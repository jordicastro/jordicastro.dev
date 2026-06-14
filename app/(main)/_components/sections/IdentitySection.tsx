"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer, SplitText, ScrollTrigger, CustomEase } from "gsap/all";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollMask } from "@/hooks/useScrollMask";
import { Pause, RefreshCcw } from "lucide-react";
import { GitFlourish, LogosFlourish, ReactButtonFlourish, SQLFlourish } from "../flourishes/SoftwareEngineerFlourishes";
import { FlourishBuilder, FlourishKey } from "@/types/types";
import { BounceTimelineFlourish, EditTextFlourish, GridFlourish, PenSquiggleFlourish } from "../flourishes/CreativeDesignerFlourishes";
import { useTheme } from "next-themes";
import { useMediaQuery } from 'usehooks-ts';

const SE_LOGOS_LOOP_TL_ID = "se-logos-carousel-loop";


const IdentitySection = ({ id }: { id?: string }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const { isAnimating, setIsAnimating } = useScrollMask();
    const masterTlRef = useRef<gsap.core.Timeline | null>(null);
    const cycleIdentitiesTl = useRef<gsap.core.Timeline | null >(null);
    const flourishBuildersRef = useRef<Partial<Record<FlourishKey, FlourishBuilder>>>({});
    const [flourishRegistryVersion, setFlourishRegistryVersion] = useState(0);
    const [iteration, setIteration] = useState(0);
    const { resolvedTheme } = useTheme();
    const { activeSectionId, prevSectionId } = useScrollMask();
    const cycleDelay = 0.5; // delay between identity sections
    const isFirstIteration = useRef(true);
    const sm = useMediaQuery('(max-width: 640px)', { initializeWithValue: false });

    useEffect(() => { // handle play/pause of the masterTl based on scrollMask and activeSectionId
        if (activeSectionId !== id && prevSectionId === id) { // pause/seek after exiting the section
            gsap.getById(SE_LOGOS_LOOP_TL_ID)?.pause(0);
            isFirstIteration.current ? 
                masterTlRef.current?.pause('start') :
                masterTlRef.current?.pause('afterIAm');
            setIteration((iter) => iter + 1); // trigger flourish reset
            
            return;
        }
        if (isAnimating && activeSectionId === id) { // pause when exiting the section through scroll Mask
            masterTlRef.current?.pause();
            return;
        }
        if (isAnimating || activeSectionId !== id) return; // wait for the scrollMask to finish updating

        masterTlRef.current?.play();
        isFirstIteration.current = false;

    }, [isAnimating, activeSectionId]);

    // use effect to reset flourish and restart timeline when switching between sm and lg screens (fix: title spanning 1 vs 2 lines)
    useEffect(() => {
        if (!masterTlRef.current || !cycleIdentitiesTl.current) return;

        const between = cycleIdentitiesTl.current.labels['between'] || 0;
        const totalProgress = cycleIdentitiesTl.current.totalProgress(); // 0 to 1 normal progress
        const totalDuration = cycleIdentitiesTl.current.totalDuration(); // actual duration
        const actualProgress = totalProgress * totalDuration; // actual progress
        if (activeSectionId === id) {
            setIteration((iter) => iter + 1); // trigger flourish reset
            if (actualProgress  < between) {
                masterTlRef.current?.restart();
            } else {
                masterTlRef.current?.seek(between);
            }
        }
    }, [sm])


    const registerFlourish = useCallback((key: FlourishKey, build: FlourishBuilder) => {
        flourishBuildersRef.current[key] = build;
        setFlourishRegistryVersion((v) => v + 1);
    }, []);

    gsap.registerPlugin(useGSAP, Observer, SplitText, ScrollTrigger, CustomEase);

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
            if (!scopeRef.current) return;
            const headings = gsap.utils.toArray<HTMLElement>(".section-heading", scopeRef.current);

            const splitHeadings = headings.map(
                (heading) =>
                    new SplitText(heading, {
                        type: "chars,words,lines",
                        linesClass: "split-line",
                        mask: "lines",
                    })
            );

            if (!splitHeadings.length) return;

            const iAmText = scopeRef.current.querySelector(".i-am-text") as HTMLElement | null;
            const iAmSplit = iAmText ? new SplitText(iAmText, {
                type: "lines, words, chars",
                mask: "lines",
            }) : null;

            cycleIdentitiesTl.current = gsap.timeline();

            const masterTL = gsap.timeline({
                defaults: { overwrite: "auto"},
                paused: true,
                onComplete: () => {
                    // trigger flourish reset
                    setIteration((iter) => iter + 1);
                    // restart the cycle
                    gsap.delayedCall(cycleDelay, () => {masterTlRef.current?.seek('afterIAm');});
                },
            }).addLabel('start', 0);
            // iAmText animation
            if (iAmSplit?.chars) {
                masterTL.fromTo(iAmSplit.chars,
                    { autoAlpha: 0, yPercent: 150 * 1 },
                    {
                        autoAlpha: 1,
                        yPercent: 0,
                        duration: 1,
                        ease: CustomEase.create("rainbow-char", "M0,0 C0.063,0.191 0.284,0.85 0.496,1.051 0.706,1.254 0.909,1 1,1 "),
                        stagger: { each: 0.08, from: "start" },
                    }, 
                )
                .addLabel('afterIAm');
            }

            // software engineer timeline
            const seTimeline = gsap.timeline();
            seTimeline
                .fromTo( // animate the heading
                    splitHeadings[0].chars,
                    { autoAlpha: 0, yPercent: 150 * 1 },
                    {
                        autoAlpha: 1,
                        yPercent: 0,
                        duration: 1,
                        ease: "power2",
                        stagger: { each: 0.02, from: "random" },
                    }, // "<=1.25" // delay on first enter: 1.25, otherwise 0.25
                )
                .to(headings[0], { autoAlpha: 1, duration: 0.25 }, "<=0.25")

            // add the child SE flourish tweens to the timeline
            const logosFlourishTween = flourishBuildersRef.current.logos?.();
            if (logosFlourishTween) {
                seTimeline.add(logosFlourishTween, "-=0.5");
            }
            const gitFlourishTween = flourishBuildersRef.current.git?.();
            if (gitFlourishTween) {
                seTimeline.add(gitFlourishTween, "<=0.25");
            }
            const reactBtnFlourishTween = flourishBuildersRef.current.reactBtn?.();
            if (reactBtnFlourishTween) {
                seTimeline.add(reactBtnFlourishTween, "<=0.4");
            }
            const sqlFlourishTween = flourishBuildersRef.current.sql?.();
            if (sqlFlourishTween) {
                seTimeline.add(sqlFlourishTween, "<=0.5");
            }

            // se transition to cd
            seTimeline.call(() => {
                gsap.getById(SE_LOGOS_LOOP_TL_ID)?.pause(0);
            }, [], "14");
            seTimeline.add(
                gsap.effects.idTransitionOut(".SE-flourish"),
                "14"
            )
            seTimeline.add(
                gsap.effects.idTransitionOut(".SE-heading", {
                    onComplete: () => {
                        gsap.set("#CD-section", { autoAlpha: 1 });
                        gsap.set(".CD-heading", { autoAlpha: 0 });
                    },
                }),
                "<=0.4"
            )

            // creative designer timeline
            gsap.set("#CD-section", { autoAlpha: 0 });

            const cdTimeline = gsap.timeline();
            cdTimeline
                .fromTo( ".CD-heading",
                    {
                        autoAlpha: 0,
                        scale: 0.8
                    },
                    {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: "back.out(2)",
                    }
                )
           const editTextTimeline = flourishBuildersRef.current.editText?.();
           if (editTextTimeline) {
               cdTimeline.add(editTextTimeline, "<");
           }
           const bounceTimeline = flourishBuildersRef.current.bounce?.();
           if (bounceTimeline) {
                cdTimeline.add(bounceTimeline, "<=0.4");
            }
            const penSquiggleTimeline = flourishBuildersRef.current.penSquiggle?.();
            if (penSquiggleTimeline) {
                cdTimeline.add(penSquiggleTimeline, "<=0.5");
            }
            const gridTimeline = flourishBuildersRef.current.grid?.();
            if (gridTimeline) {
                cdTimeline.add(gridTimeline, "<=0.6");
            }
            
            cdTimeline.add(
                gsap.effects.idTransitionOut(".CD-flourish"),
                "18.6"
            )
            cdTimeline.add(
                gsap.effects.idTransitionOut(".CD-heading", {
                    onComplete: () => {
                        gsap.set("#CD-section", { autoAlpha: 0 });
                    },
                }),
                "<=0.4"
            )

            cycleIdentitiesTl.current.add(seTimeline, ">");
            cycleIdentitiesTl.current.addLabel('between', `>+=${cycleDelay+0.9}`);
            cycleIdentitiesTl.current.add(cdTimeline, `>+=${cycleDelay}`);

            masterTL.add(cycleIdentitiesTl.current);

            masterTlRef.current = masterTL;
            
            // pin the section and animate the timeline node along the path
            const observer = Observer.create({
                target: scopeRef.current,
                type: "wheel,touch",
                preventDefault: true,
                tolerance: 20, // prevent accidental triggers by reducing touch drag sensitivity 
                wheelSpeed: -1, // invert wheel direction to correct natural touch onUp and onDown direction
                onUp: (self) => {
                    !isAnimating && setIsAnimating(true, "down")
                    console.log('isDragging works only for touch events?', self.isDragging)
                },
                onDown: (self) => {
                    !isAnimating && setIsAnimating(true, "up")
                    console.log('isDragging works only for touch events?', self.isDragging)
                },
            })

            return () => {
                splitHeadings.forEach((split) => split.revert());
                iAmSplit?.revert();
                observer.kill();
                seTimeline.kill();
                cdTimeline.kill();
                cycleIdentitiesTl.current?.kill();
                masterTlRef.current?.kill();
                masterTlRef.current = null;
            };

        },
        { scope: scopeRef, dependencies: [flourishRegistryVersion] }
    );

    return (
        <div ref={scopeRef} id={id} className="relative h-svh w-full bg-neutral-50 dark:bg-neutral-950 font-semibold overflow-hidden text-center"> 
            <p className="absolute top-12 left-12 lg:top-20 lg:left-40 text-2xl/normal md:text-3xl/normal lg:text-3xl/normal i-am-text font-medium z-10">I am a ...</p>
            <SESection registerFlourish={registerFlourish}/>
            <CDSection registerFlourish={registerFlourish} iteration={iteration}/>

        </div>
    );
};

interface IDSectionProps {
    registerFlourish: (key: FlourishKey, build: FlourishBuilder) => void;
    iteration?: number;
}
const SESection = ({registerFlourish}: IDSectionProps) => (
    <section className="id-section" id="SE-section">
            <div className="absolute inset-0 font-medium">
                <GitFlourish flourishKey="git" register={registerFlourish}/>
                <div className="relative abs-center w-[calc(100vw-2rem)] sm:w-max sm:max-w-none whitespace-normal sm:whitespace-nowrap">
                    <h2 className="SE-heading section-heading text-6xl/normal md:text-7xl/normal lg:text-8xl/normal will-change-transform font-bold">Software Engineer</h2>

                    <LogosFlourish flourishKey="logos" register={registerFlourish} className="absolute inset-0 w-full h-full"/>
                </div>
                <SQLFlourish flourishKey="sql" register={registerFlourish}/>
                <ReactButtonFlourish flourishKey="reactBtn" register={registerFlourish} />
            </div>
    </section>
)

const CDSection = ({ registerFlourish, iteration }: IDSectionProps) => (
    <section className="id-section" id="CD-section">
        <div className="absolute inset-0">
            <h2 className="CD-heading section-heading abs-center w-[calc(100vw-2rem)] sm:w-max sm:max-w-none whitespace-normal sm:whitespace-nowrap text-6xl/normal md:text-7xl/normal lg:text-8xl/normal will-change-transform font-bold ">Creative Designer</h2>
            <BounceTimelineFlourish flourishKey="bounce" register={registerFlourish} iteration={iteration}/>
            <GridFlourish flourishKey="grid" register={registerFlourish} iteration={iteration} />
            <PenSquiggleFlourish flourishKey="penSquiggle" register={registerFlourish} iteration={iteration} />
            <EditTextFlourish flourishKey="editText" register={registerFlourish} iteration={iteration}/>
        </div>
    </section>
)

export default IdentitySection;