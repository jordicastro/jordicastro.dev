"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge"
import { ReactionData, ReactionEmoji } from "@/types/types";
import EmojiExplosion from "./EmojiExplosion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { useReactions } from "@/hooks/useReactions";

const ReactionPill = ({ className, storyId }: { className?: string, storyId: string }) => {
    const [hasReacted, setHasReacted] = useState(false);
    const [activeEmoji, setActiveEmoji] = useState<ReactionEmoji | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [explodeKey, setExplodeKey] = useState(0);
    const scope = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);
    const activeEmojiRef = useRef<ReactionEmoji | null>(null);
    const initHighlight = useRef(false);
    const isLockedRef = useRef(false);
    const canHoverRef = useRef(true);
    const hoverCooldownRef = useRef<number | null>(null);
    const isDirtyRef = useRef(false);
    const localSelectedEmojiRef = useRef<ReactionEmoji | null>(null);
    const isMobile = useMediaQuery("(max-width: 768px)", { initializeWithValue: false });
    const { reactionData, selectedEmoji, totalReactions, fetchReactions, updateUserReaction, isLoading } = useReactions();

    // local state to allow debounce calls to update db (as opposed to updating the db every click)
    const [localReactionData, setLocalReactionData] = useState<ReactionData | null>(null);
    const [localSelectedEmoji, setLocalSelectedEmoji] = useState<ReactionEmoji | null>(null);
    const [localTotalReactions, setLocalTotalReactions] = useState(0);
    const [isDirty, setIsDirty] = useState(false);
    


    const displayEmojis: ReactionEmoji[] = [
        '❤️', '👍', '🔥'
    ]

    gsap.registerPlugin(useGSAP);

    // sync refs with state
    useEffect( () => {
        activeEmojiRef.current = activeEmoji;
    }, [activeEmoji]);

    useEffect(() => {
        localSelectedEmojiRef.current = localSelectedEmoji;
    }, [localSelectedEmoji]);

    useEffect(() => {
        isDirtyRef.current = isDirty;
    }, [isDirty]);

    // hover to open only on desktop
    useEffect( () => {
        if (isMobile) {
            canHoverRef.current = false;
        } else {
            canHoverRef.current = true;
        }
    }, [isMobile]);

    // fetch reactions on mount
    useEffect(() => {
        fetchReactions(storyId);
    }, [fetchReactions, storyId]);

    // set local state when fetchReactions returns. isDirty used to determine if the db and local state are out of sync
    useEffect(() => {
        if (!reactionData || isDirty) return;

        setLocalReactionData(reactionData);
        setLocalSelectedEmoji((selectedEmoji as ReactionEmoji | null) ?? null);
        setLocalTotalReactions(totalReactions);
        setHasReacted(Boolean(selectedEmoji));
        setActiveEmoji((selectedEmoji as ReactionEmoji | null) ?? null);
    }, [reactionData, selectedEmoji, totalReactions, isDirty]);

    // debounced call to update user's reaction in the db whenever isDirty (out of sync local & db state)
    useEffect(() => {
        if (!isDirty) return;

        const timeout = window.setTimeout(async () => {
            await updateUserReaction(storyId, localSelectedEmojiRef.current);
            setIsDirty(false);
        }, 3000); // 3 second debounce

        return () => {
            window.clearTimeout(timeout);
        };
    }, [isDirty, storyId, updateUserReaction, localSelectedEmoji]);

    // unmount cleanup: sync local & db state
    useEffect(() => {
        return () => {
            if (isDirtyRef.current) {
                void updateUserReaction(storyId, localSelectedEmojiRef.current);
            }
        };
    }, [storyId, updateUserReaction]);

    const { contextSafe } = useGSAP( () => {
        const pop = popoverRef.current;
        const hi = highlightRef.current;
        if (!pop || !hi) return;

        if (initHighlight.current) return; // if highlight is already initialized
        if (!reactionData || !activeEmoji) return; // if reactionData or activeEmoji is not set yet

        const idx = reactionData.findIndex(r => r.emoji === activeEmoji);
        if (idx < 0) return; // not found

        gsap.set(hi, { x: idx * 58, autoAlpha: 0 });
        gsap.to(hi, { autoAlpha: 1, duration: 0.2, ease: "power1.out" }); // 200ms, just like the color transition on the border of the reactionBar
        initHighlight.current = true; // mark highlight as initialized

    }, {scope: scope, dependencies: [localReactionData, activeEmoji]});

    const openPopover = contextSafe(() => {
        gsap.to(popoverRef.current, { autoAlpha: 1, y: -10, duration: 0.2, ease: "power1.out", overwrite: true });
    });
    const closePopover = contextSafe((force: boolean = false) => {
        if (isLockedRef.current && !force) return; // do nothing if popover is locked
        gsap.to(popoverRef.current, { autoAlpha: 0, y: 0, duration: 0.2, ease: "power1.in", overwrite: true });
    });

    useEffect( () => {
        isLockedRef.current = isLocked;
        if (isLocked === true) {
            // add an event listener for the next click anywhere on the screen to unlock
            const onPointerDown = (e: PointerEvent) => {
                const root = scope.current;
                if (!root) return;
                if (root.contains(e.target as Node)) return; // click inside component: do nothing
                setIsLocked(false); // click outside component: unlock
                closePopover(true); // force close, because isLockedRef wont get updated to true until this finishes.

            }
            document.addEventListener('pointerdown', onPointerDown);
            return () => document.removeEventListener('pointerdown', onPointerDown);
        }
    }, [isLocked])

    const disableHoverTemporarily = (ms = 700) => {
        canHoverRef.current = false;
        if (hoverCooldownRef.current) window.clearTimeout(hoverCooldownRef.current);
        hoverCooldownRef.current = window.setTimeout(() => {
            if (window.innerWidth > 500) {
                canHoverRef.current = true;
            }
        }, ms)
    }

    const togglePopoverLock = () => {
        setIsLocked((prev) => {
            const next = !prev;
            if (next) openPopover();
            else closePopover();
            return next;
        })
    }

    const handleReaction = (selectedEmoji: ReactionEmoji, rightClick: boolean = false) => {
        const prevActive = activeEmojiRef.current;

        if (!localReactionData) return;

        const removeReaction = () => {
            initHighlight.current = false;
            setLocalReactionData((data) =>
                data
                    ? data.map((r) => {
                        if (r.emoji === prevActive) return { ...r, count: Math.max(0, r.count - 1) };
                        return r;
                    })
                    : null
            );
            setLocalSelectedEmoji(null);
            setLocalTotalReactions((t) => Math.max(0, t - 1));
            setActiveEmoji(null);
            setHasReacted(false);
            setIsDirty(true);
        };

        // remove reaction with a right click
        if (rightClick) {
            if (prevActive !== selectedEmoji) return; // remove reaction only on current active
            removeReaction();
            return;
        }

        if (prevActive === selectedEmoji && isMobile) {
            removeReaction();
            return;

        } else if (prevActive === selectedEmoji && !isMobile) {
            return;
        }

        setLocalReactionData((data) =>
            data
                ? data.map((r) => {
                    if (prevActive && r.emoji === prevActive) return { ...r, count: Math.max(0, r.count - 1) };
                    if (r.emoji === selectedEmoji) return { ...r, count: r.count + 1 };
                    return r;
                })
                : null
        );

        setLocalTotalReactions((t) => (prevActive ? t : t + 1));
        setLocalSelectedEmoji(selectedEmoji);
        setIsDirty(true);

        // STATE:
        setHasReacted(true);
        setActiveEmoji(selectedEmoji);
        //GSAP:
        moveHighlight(selectedEmoji);
        const isFirstTime = !prevActive
        if (isFirstTime) { // first time animation: emojiExplosion
            // force close the popover
            setIsLocked(false);
            closePopover(true);
            disableHoverTemporarily(1500); // disable hover so the popover doesn't immediately reopen
            // trigger the animation
            setExplodeKey(k => k + 1)
        }
     }

    const moveHighlight = contextSafe((emoji: ReactionEmoji) => {
        if (!localReactionData) return;
        const el = highlightRef.current;
        if (!el) return;

            gsap.to(highlightRef.current, {
                x: localReactionData.findIndex(r => r.emoji === emoji) * 58,
                duration: 0.2,
                ease: "power2.out",
                overwrite: true,
            });
    });

    return (
        <div className={cn("reaction-pill", className)} ref={scope}>
            <div
                className="relative w-auto h-auto"
                onMouseEnter={() => { if (canHoverRef.current) openPopover(); }}
                onMouseLeave={() => { if (canHoverRef.current) closePopover(); }}
            >
                {/* reactionBar */}
                <div className={twMerge(
                        `w-30 h-9 border-2 border-neutral-300 rounded-full flex items-center justify-between px-3 text-sm font-bold hover:cursor-pointer select-none transition-colors duration-200 ease-out`,
                        hasReacted ? 'border-sky-500' : 'border-neutral-300',
                    )}
                    data-cursor='pointer'
                    role="button"
                    onClick={togglePopoverLock} // lock popOver onClick
                >
                    <div className="flex-1 line-clamp-1">
                        {displayEmojis.map((emoji, i) => (
                            <span
                                key={i}
                                className={twMerge(
                                    'text-[16px]',
                                    i === 0 ? 'ml-0' : '-ml-1.25',
                                )}
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>
                    <span>{localTotalReactions}</span>
                </div>
                {/* emojiExplosion */}
                <EmojiExplosion className="abs-center" trigger={explodeKey} />
                {/* reactionPopover */}
                <div
                    ref={popoverRef}
                    className="absolute -right-18 sm:abs-x-center bottom-5/6 w-48 h-14 flex justify-between items-center px-2 py-2 text-sm font-medium rounded-xl bg-neutral-100/50 dark:bg-neutral-700/50 backdrop-blur-lg shadow-lg"
                    style={{ visibility: "hidden"}}
                >
                    {/* activeHighlight */}
                    <div
                        ref={highlightRef}
                        className="absolute inset-y-2 w-14.5 rounded-lg bg-neutral-200/80 dark:bg-neutral-700/80 backdrop-blur-lg -z-1"
                        style={{ visibility: localSelectedEmoji ? "visible" : "hidden" }}
                    />

                    {/* popoverItems */}
                    {localReactionData?.map( (r, i) => (
                        <div
                            key={i}
                            className={twMerge(
                                `flex-center gap-1 h-full w-full rounded-lg hover:cursor-pointer group/reactionItem select-none`,
                            )}
                            data-cursor='pointer'
                            role="button"
                            onClick={() => handleReaction(r.emoji)}
                            onContextMenu={(e) => { e.preventDefault(); handleReaction(r.emoji, true)}}
                        >
                            <span className="text-[16px]">{r.emoji}</span>
                            <span>{r.count}</span>
                        </div>
                     ) )}
                </div>
            </div>
        
        </div>
    )
}

export default ReactionPill