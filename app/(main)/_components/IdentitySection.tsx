"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer, SplitText, ScrollTrigger, CustomEase } from "gsap/all";
import { useCallback, useRef, useState } from "react";
import { useScrollMask } from "@/hooks/useScrollMask";
import { RefreshCcw } from "lucide-react";
import { GitFlourish, ReactButtonFlourish, SQLFlourish, TagFlourish } from "./_flourishes/SoftwareEngineerFlourishes";
import { FlourishBuilder, FlourishKey } from "@/types/types";
import { BounceTimelineFlourish, EditTextFlourish, GridFlourish, PenSquiggleFlourish } from "./_flourishes/CreativeDesignerFlourishes";


const IdentitySection = ({ id }: { id?: string }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const animatingRef = useRef<boolean>(true);
    const { isAnimating, setIsAnimating } = useScrollMask();
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const flourishBuildersRef = useRef<Partial<Record<FlourishKey, FlourishBuilder>>>({});
    const [flourishRegistryVersion, setFlourishRegistryVersion] = useState(0);
    const [iteration, setIteration] = useState(0);
    const cycleDelay = 0.5; // delay between identity sections


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

            const cycleIdentitiesTl = gsap.timeline({
                repeat: -1,
                repeatDelay: cycleDelay,
                onRepeat: () => {
                    setIteration((iter) => iter + 1);
                },
            });


            const masterTL = gsap.timeline({
                defaults: { overwrite: "auto" },
                onComplete: () => {
                    animatingRef.current = false;
                },
                scrollTrigger: {
                    trigger: scopeRef.current,
                    start: "top 90%",
                    end: "bottom 10%",
                    toggleActions: "play reset play reset",
                }
            });
            // iAmText animation
            if (iAmSplit?.chars) {
                masterTL.fromTo(iAmSplit.chars,
                    { autoAlpha: 0, yPercent: 150 * 1 },
                    {
                        autoAlpha: 1,
                        yPercent: 0,
                        duration: 1,
                        delay: 2,
                        ease: CustomEase.create("rainbow-char", "M0,0 C0.063,0.191 0.284,0.85 0.496,1.051 0.706,1.254 0.909,1 1,1 "),
                        stagger: { each: 0.08, from: "start" },
                    }, 
                )
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
                .to(headings, { autoAlpha: 1, duration: 0.25 }, "<=0.25") // 

            // add the child SE flourish tweens to the timeline
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
            const tagFlourishTween = flourishBuildersRef.current.tag?.();
            if (tagFlourishTween) {
                seTimeline.add(tagFlourishTween, "<=0.5");
            }

            // se transition to cd
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

            cycleIdentitiesTl.add(seTimeline, ">");
            cycleIdentitiesTl.add(cdTimeline, `>=${cycleDelay}`);

            masterTL.add(cycleIdentitiesTl);

            tlRef.current = masterTL;
            
            // pin the section and animate the timeline node along the path
            const observer = Observer.create({
                target: scopeRef.current,
                type: "wheel,touch",
                preventDefault: true,
                tolerance: 10,
                onUp: (self) => {
                    !isAnimating && setIsAnimating(true, "up")
                        // update iteration so the flourishes reset
                        // console.log('scrolling up, updating iteration')
                    // setIteration((iter) => iter + 1);
                },
                onDown: () => {
                    !isAnimating && setIsAnimating(true, "down")
                    // update iteration so the flourishes reset
                    // console.log('scrolling down, updating iteration')
                    // setIteration((iter) => iter + 1);
                },
            })

            return () => {
                splitHeadings.forEach((split) => split.revert());
                iAmSplit?.revert();
                observer.kill();
            };

        },
        { scope: scopeRef, dependencies: [flourishRegistryVersion] }
    );

    const replayAnimation = contextSafe(() => {
        tlRef.current?.restart();
    });

    return (
        <div ref={scopeRef} id={id} className="relative h-svh w-full bg-neutral-50 dark:bg-neutral-950 font-semibold overflow-hidden text-center"> 
            <div className="absolute top-12 right-12 w-12 h-12 rounded-full flex-center hover:cursor-pointer z-10" data-cursor="pointer-2" onClick={replayAnimation}>
                <RefreshCcw className="text-neutral-500"/>
            </div>
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
                <TagFlourish flourishKey="tag" register={registerFlourish}/>
                <GitFlourish flourishKey="git" register={registerFlourish}/>
                <h2 className="SE-heading section-heading abs-center w-7/8 text-6xl/normal md:text-7xl/normal lg:text-8xl/normal will-change-transform font-bold">Software Engineer</h2>
                <SQLFlourish flourishKey="sql" register={registerFlourish}/>
                <ReactButtonFlourish flourishKey="reactBtn" register={registerFlourish} />
            </div>
    </section>
)

const CDSection = ({ registerFlourish, iteration }: IDSectionProps) => (
    <section className="id-section" id="CD-section">
        <div className="absolute inset-0">
            <h2 className="CD-heading section-heading abs-center w-7/8 text-6xl/normal md:text-7xl/normal lg:text-8xl/normal will-change-transform font-bold ">Creative Designer</h2>
            <BounceTimelineFlourish flourishKey="bounce" register={registerFlourish} iteration={iteration}/>
            <GridFlourish flourishKey="grid" register={registerFlourish} iteration={iteration} />
            <PenSquiggleFlourish flourishKey="penSquiggle" register={registerFlourish} iteration={iteration} />
            <EditTextFlourish flourishKey="editText" register={registerFlourish} iteration={iteration}/>
        </div>
    </section>
)

export default IdentitySection;