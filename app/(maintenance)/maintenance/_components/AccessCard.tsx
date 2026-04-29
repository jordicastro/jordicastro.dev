"use client";

import { useGSAP } from "@gsap/react";
import { CustomEase, CustomWiggle, MotionPathPlugin, SplitText } from "gsap/all";
import gsap from "gsap";
import { CornerDownLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Logo from "@/components/Logo";

gsap.registerPlugin(useGSAP, CustomEase, CustomWiggle, SplitText, MotionPathPlugin);

interface AccessCardProps {
    title: string;
    onAccessGranted?: () => void; // callback for onCorrectPassword starts, to fade the LogoBounce instances
    onComplete?: () => void; // callback for when onCorrectPassword finishes, to navigate using the parent MaintenancePage
}

const AccessCard = ({ title, onAccessGranted, onComplete }: AccessCardProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const [password, setPassword] = useState(""); // the actual password
    const inputRef = useRef<HTMLInputElement>(null); // the dot representation of the password
    const displayRef = useRef<HTMLDivElement>(null); // the static el that is used to replace the input for the stagger animation
    // .env test password
    const TEST_PASSWORD = process.env.NEXT_PUBLIC_TEST_PASSWORD ?? null;

    const displayValue = password.length ? "• ".repeat(password.length) : "Enter password...";

    useEffect(() => {
        if (password.length === 0) {
            resetInput();
        }

        if (password.length > 5) { // display enter button on minimum 5 chars
            toggleEnterButton(true);
        } else toggleEnterButton(false);
    }, [password]);

    gsap.registerEffect({
        name: "idTransitionOut",

        effect: (targets: gsap.TweenTarget, config: { onComplete?: () => void, each?: number, from?: "start" | "center" | "end" | "random" }) => {
            const tl = gsap.timeline({
                onComplete: config.onComplete ?? (() => {}),
            });
            tl.to(targets, {
                    autoAlpha: 0,
                    scale: 0.8,
                    duration: 0.5,
                    stagger: {
                        each: config.each ?? 0.05,
                        from: config.from ?? "random",
                    },
                    ease: "back.in(2)",
                })
            return tl;
        }
    })

    const { contextSafe } = useGSAP(
        () => {
            CustomWiggle.create("wiggle-easeOut", { wiggles: 6, type: "easeOut" });

            const enterButton = gsap.utils.toArray(".input-enter-button", scopeRef.current)[0] as HTMLElement | undefined;
            const welcomeWrapper = gsap.utils.toArray(".welcome-wrapper", scopeRef.current)[0] as HTMLElement | undefined;
            const welcomeText = gsap.utils.toArray(".welcome-text", scopeRef.current)[0] as HTMLElement | undefined;
            const welcomeLogo = gsap.utils.toArray(".welcome-logo", scopeRef.current)[0] as HTMLElement | undefined;
            if (!enterButton || !displayRef.current || !welcomeWrapper || !welcomeText || !welcomeLogo) return;
            // setup: enter and static display are hidden
            gsap.set(enterButton, { autoAlpha: 0 });
            gsap.set(displayRef.current, { autoAlpha: 0 });
            gsap.set([welcomeWrapper, welcomeText, welcomeLogo], { autoAlpha: 0 });
        },
        { scope: scopeRef, dependencies: [] }
    );

    const handleEnter = contextSafe(() => {
        if (password.length < 5) return;

        gsap.delayedCall(0.5, toggleEnterButton, [false]);
        if (password === TEST_PASSWORD) {
            handleCorrectPassword();
        } else {
            handleIncorrectPassword();
        }
        
    });

    const handleCorrectPassword = contextSafe(() => { // fade out cardItems, collapse card, clear LogoBounce instances, then display logo with curved 'welcome' animation
        // call the callback
        onAccessGranted?.();

        const passwordInput = inputRef.current;
        const accessTitle = gsap.utils.toArray(".access-title", scopeRef.current)[0] as HTMLElement | undefined;
        const passwordInputContainer = passwordInput?.parentElement;
        const accessCard = gsap.utils.toArray(".access-card", scopeRef.current)[0] as HTMLElement | undefined;
        const welcomeWrapper = gsap.utils.toArray(".welcome-wrapper", scopeRef.current)[0] as HTMLElement | undefined;
        const welcomeLogo = gsap.utils.toArray(".welcome-logo", scopeRef.current)[0] as HTMLElement | undefined;
        const welcomeText = gsap.utils.toArray(".welcome-text", scopeRef.current)[0] as HTMLElement | undefined;

        if (!passwordInput || !accessTitle || !passwordInputContainer || !accessCard || !welcomeWrapper || !welcomeLogo || !welcomeText) return;

        const welcomeChars = new SplitText(welcomeText, { type: "chars" });
        const randSelect = Math.abs(gsap.utils.random(0, 1, 1));
        const charTl = randSelect < 1 ? getWelcomeCharAnim(welcomeChars) : getAltWelcomeCharAnim(welcomeChars);
        // const charTl = getWelcomeCharAnim(welcomeChars);
        // const charTl = getAltWelcomeCharAnim(welcomeChars);
        const tl = gsap.timeline({ onComplete: () => {
            welcomeChars.revert();
            gsap.set([welcomeWrapper, welcomeText, welcomeLogo, accessCard] , { autoAlpha: 0, display: "none" });
            // call the onComplete callback to navigate to the home page
            onComplete?.();
        } });
        // fade out accessCard
        tl.to([accessTitle, passwordInputContainer], {
            autoAlpha: 0,
            scaleX: 0,
            duration: 0.8,
            ease: "power2.in",
            stagger: {
                each: 0.1,
                from: "start"
            },
        })
        .to(accessCard, {
            duration: 0.8,
            scaleX: 0,
            ease: "power2.inOut",

        }, "<0.2")
        // display welcome logo and text
        .set([welcomeWrapper, welcomeText], { display: "block", autoAlpha: 1 })
        .fromTo(welcomeLogo, {
            autoAlpha: 0,
            scale: 0,
        }, {
            autoAlpha: 1,
            scale: 1,
            ease: "back.out(2)",
            duration: 0.8,
            delay: 0.2,
        })
        .add(charTl, "<0.1");
        // fade out anim 1: simple back.out on logo and chars

        const fadeOutTl = getFadeOutAnim(welcomeLogo, welcomeText);
        // fade out anim 2: contract & shrink chars towards logo, shrink logo, then physics 2d explode chars while fading out logo
        // const fadeOutTl = getAltFadeOutAnim();

        tl.add(fadeOutTl, ">=2");

    });

    const getWelcomeCharAnim = contextSafe((welcomeChars: SplitText) => { // calculate the rotation and y offset and animate from a rand rotation and y 25 to the curved smiley with stagger 0.1
        const charLength = welcomeChars.chars.length;
        const midIndex = (charLength - 1) / 2;
        const maxYOffset = 18;
        const tl = gsap.timeline();

        welcomeChars.chars.forEach((char, index) => {
            const rotation = gsap.utils.mapRange(0, charLength - 1, 30, -30, index);
            const distanceFromCenter = Math.abs(index - midIndex);
            const normalizedDistance = distanceFromCenter / Math.max(midIndex, 1);
            const y = normalizedDistance ** 2 * maxYOffset * -1; // smaller y offset for chars closer to mid for a parabolic shape, -1 for a smiley

            tl.fromTo(char, {
                autoAlpha: 0,
                rotation: gsap.utils.random(-90, 90),
                y: 25,
            }, {
                autoAlpha: 1,
                rotation,
                y,
                duration: 0.8,
                ease: "expo.out",
            }, index * 0.1);
        });

        return tl;
    });

    const getAltWelcomeCharAnim = contextSafe((welcomeChars: SplitText) => { // alt animation where the chars follow a curved motion path svg with stagger starting from the last char with autoRotate for a wave effect
        const tl = gsap.timeline();
        const length = welcomeChars.chars.length;
        const spacingBias = 1.25;

        welcomeChars.chars.forEach((char, index) => {
            const t = index / Math.max(length - 1, 1);
            const centeredT = t * 2 - 1;
            const basePos = (Math.sign(centeredT) * Math.abs(centeredT) ** spacingBias + 1) / 2;
            // nudge some chars so gap is uniform
            const charNudge = index === 1 ? 0.02 : index === 2 ? 0.01 : index === 5 ? -0.01 : 0;
            const normalizedPos = basePos + charNudge;
            tl.fromTo(char, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                motionPath: {
                    path: "#curved-path",
                    align: "#curved-path",
                    autoRotate: true,
                    start: 0,
                    end: normalizedPos,
                },
                duration: 1.5,
                ease: "power2.out",
            }, (welcomeChars.chars.length - 1 - index) * 0.1); // reverse stagger
        });

        return tl;
    });

    const getFadeOutAnim = contextSafe((welcomeLogo: HTMLElement, welcomeText: HTMLElement) => { 
        const tl = gsap.timeline();

        tl.add(
            gsap.effects.idTransitionOut([welcomeLogo, welcomeText], {
                each: 0.1,
                from: "start",
            }));

        return tl;
    });

    const handleIncorrectPassword = contextSafe(() => { // shake the input container and stagger the display dots down to reset input
        const passwordInput = inputRef.current;
        const passwordDisplay = displayRef.current;
        const passwordInputContainer = passwordInput?.parentElement;

        if (!passwordInput || !passwordDisplay || !passwordInputContainer) return;

        // instantly replace the input with the static display
        passwordDisplay.textContent = getDisplayValue();
        gsap.set(passwordInput, { autoAlpha: 0 });
        gsap.set(passwordDisplay, { autoAlpha: 1 });

        // shake the container and stagger the static chars
        const passwordSplit = new SplitText(passwordDisplay, { type: "chars" });
        const tl = gsap.timeline({
            onComplete: () => {
                passwordSplit.revert();
                resetInput();
            }
        });

        tl.to(passwordInputContainer, {
            ease: "wiggle-easeOut",
            duration: 0.80,
            x: 20,
        }).to(
            passwordSplit.chars,
            {
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: "power1.inOut",
                stagger: {
                    each: 0.05,
                    from: "start"
                }
            },
            ">"
        );
    });

    const resetInput = contextSafe(() => { // clear and replace static display with a fade in input
        const passwordInput = inputRef.current;
        const passwordInputContainer = passwordInput?.parentElement;
        const passwordDisplay = displayRef.current;
        if (!passwordInput || !passwordInputContainer || !passwordDisplay) return;
        // clear and hide static display
        gsap.set(passwordDisplay, { autoAlpha: 0 });
        passwordDisplay.textContent = "";
        // reset input and fade in
        gsap.set(passwordInputContainer, { x: 0, clearProps: "x" });
        gsap.set(passwordInput, { clearProps: "all" });
        gsap.fromTo(passwordInput,
            {
                autoAlpha: 0,

            },
            {
                autoAlpha: 1,
                duration: 0.8,
                ease: "power1.out",
            }
        );
        setPassword("");
    });

    const getDisplayValue = () => {
        if (password.length < 20) {
            return displayValue;
        } else {
            return "• ".repeat(20); // make sure the stagger animation doesnt go on forever for long passwords
        }

    }

    const toggleEnterButton = (show: boolean) => {
        const enterButton = gsap.utils.toArray(".input-enter-button", scopeRef.current)[0] as HTMLElement;
        if (!enterButton) return;

        gsap.to(enterButton, { autoAlpha: show ? 1 : 0, duration: 0.2, ease: "power1.out", overwrite: true });
    }

    const isAllSelected = () => {
        const input = inputRef.current;
        if (!input) return false;

        const selectionStart = input.selectionStart ?? 0;
        const selectionEnd = input.selectionEnd ?? 0;

        return selectionStart === 0 && selectionEnd === input.value.length;
    };

    const moveCaretToEnd = () => {
        requestAnimationFrame(() => {
            const input = inputRef.current;
            if (!input) return;
            const end = input.value.length;
            input.setSelectionRange(end, end);
        });
    };

    const handleFocus = () => {
        requestAnimationFrame(() => inputRef.current?.select());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") return;

        const fullSelection = isAllSelected();
        const isModifierClear = e.key === "Backspace" && (e.ctrlKey || e.metaKey || e.altKey);

        if (isModifierClear) {
            e.preventDefault();
            setPassword("");
            moveCaretToEnd();
            return;
        }

        if (e.key === "Backspace") {
            e.preventDefault();
            setPassword((prev) => (fullSelection ? "" : prev.slice(0, -1)));
            moveCaretToEnd();
            return;
        }

        if (e.key === "Delete") {
            e.preventDefault();
            setPassword("");
            moveCaretToEnd();
            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            handleEnter();
            return;
        }

        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            setPassword((prev) => (fullSelection ? e.key : prev + e.key));
            moveCaretToEnd();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        if (!pastedText) return;

        setPassword((prev) => (isAllSelected() ? pastedText : prev + pastedText));
        moveCaretToEnd();
    };

    return (
        <div ref={scopeRef}>
            {/* access-card */}
            <div className="access-card abs-center z-50 h-50 w-125 rounded-xl bg-bg-secondary flex-center-col gap-11">
                {/* title */}
                <h2 className="access-title text-2xl text-text-primary tracking-wide font-medium">{title}</h2>

                {/* input password */}
                <div className="password-input-container relative flex h-11 w-1/2 items-center justify-start rounded-full border-2 border-text-secondary px-4 transition-colors focus-within:border-sky-400 overflow-hidden">
                    <input
                        ref={inputRef}
                        type="text"
                        value={displayValue}
                        readOnly
                        onFocus={handleFocus}
                        onClick={handleFocus}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        aria-label="Password"
                        autoComplete="off"
                        spellCheck={false}
                        className={twMerge(
                            "password-input w-full bg-transparent text-md outline-none tracking-wide",
                            password.length ? "text-text-primary" : "text-text-secondary"
                        )}
                    />
                    <div
                        ref={displayRef}
                        aria-hidden="true"
                        className={twMerge(
                            "pointer-events-none abs-y-center left-4 right-4 overflow-hidden whitespace-nowrap bg-transparent text-md tracking-wide",
                            password.length ? "text-text-primary" : "text-text-secondary"
                        )}
                    />
                    {/* enter button */}
                    <div className={twMerge(
                        "input-enter-button abs-y-center right-0 h-full w-10 rounded-r-full bg-bg-tertiary flex-center cursor-pointer",
                    )}
                        data-cursor="pointer-2"
                        role="button"
                        onClick={() => handleEnter()}
                    >
                        <CornerDownLeft  className="text-neutral-200 w-5 h-5 "/>
                    </div>
                </div>
            </div>
            {/* logo on access (correctPassword) */}
            <div className="welcome-wrapper abs-center z-60 w-35 h-35 hidden">
                <Logo className="welcome-logo abs-center" width={81} height={81}/>
                <h2 className="welcome-text abs-x-center bottom-0 w-max whitespace-nowrap text-2xl tracking-widest text-neutral-200 pointer-events-auto font-medium select-none">
                    Welcome
                </h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="101" height="21" viewBox="0 0 101 21" fill="none" className="abs-x-center bottom-7 left-16 opacity-0">
                <path id="curved-path" d="M0.260925 0.426514C11.1584 7.09318 29.1071 20.4265 50.2609 20.4265C71.4148 20.4265 89.3635 7.09318 100.261 0.426514" stroke="#0ACF83"/>
                </svg>
            </div>
        </div>
    );
};

export default AccessCard;