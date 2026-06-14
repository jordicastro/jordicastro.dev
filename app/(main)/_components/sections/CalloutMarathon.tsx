import IconButton from '@/components/IconButton';
import { ThumbsUp } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import MarathonRollingTime from '../MarathonRollingTime';
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react';
import { SplitText, ScrollTrigger, CustomWiggle, DrawSVGPlugin } from "gsap/all";
import { useCallback, useRef } from 'react';
import { useTheme } from 'next-themes';
import { FlourishBuilder } from '@/types/types';
import CameraBurst from '../CameraBurst';

const CalloutMarathon = ({ id }: { id?:string }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const rollingTimeAnimRef = useRef<Record<string, FlourishBuilder>>({});
    const { theme } = useTheme();

    const mobile = useMediaQuery("(max-width: 463px)", { initializeWithValue: false });
    const sm = useMediaQuery("(max-width: 640px)", { initializeWithValue: false });
    const md = useMediaQuery("(max-width: 768px) and (min-width: 641px)", { initializeWithValue: false });
    const mdBreakpoint = useMediaQuery("(max-width: 910px) and (min-width: 769px)", { initializeWithValue: false });
    const rollingTimeCN = mobile ?
        "absolute left-55 top-24 text-lg" : sm ? // actual mobile
        "absolute left-0 top-24 text-lg" : md ? // sm screens 
        "absolute left-0 top-35" : mdBreakpoint ? // md screens
        "absolute left-0 top-40" : "absolute left-0 top-40" // md breakpoint and up
    const calloutGapCN = mobile ?
        "gap-12" : sm ?
        "gap-20" : md ?
        "gap-30" : mdBreakpoint ?
        "gap-30" : "gap-30";
    
    const textSize = md ? "text-6xl" : sm ? "text-5xl" : "text-7xl";
    const widthHeight = md ? "w-27 h-12" : sm ? "w-22 h-10" : "w-35 h-15";

    const registerRollingTimeAnimation = useCallback((key: string, build: FlourishBuilder) => {
            rollingTimeAnimRef.current[key] = build;
        }, []);


    gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger, CustomWiggle, DrawSVGPlugin);

    const { contextSafe } = useGSAP(
        () => {
            const calloutText = gsap.utils.toArray<HTMLElement>(".callout-text", scopeRef.current)[0];
            const kudosBtn = gsap.utils.toArray<HTMLElement>(".kudos-btn", scopeRef.current)[0];
            const cameraBurst = gsap.utils.toArray<HTMLElement>(".camera-burst", scopeRef.current)[0];
            if (!calloutText || !kudosBtn) return;

            const splitTextTl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.9 } });
            const calloutSplit = new SplitText(calloutText, {
                type: "lines, words",
                linesClass: "callout-line",
                wordsClass: "callout-word++",
                mask: "lines",
            })

            gsap.set('.callout-line-mask', { overflowX: "visible" })

            const calloutSplitWords = calloutSplit.words as HTMLElement[];
            const firstThree = [".callout-word1, .callout-word2, .callout-word3"];
            const jordi = ".callout-word4";
            const nextTwo = [".callout-word5, .callout-word6"];
            const marathon = calloutSplitWords[6] as HTMLElement;
            const last = ".callout-word8";

            const underlineSVG = createWordUnderlineSVG(marathon);
            const underlinePath = underlineSVG.querySelector("path") as SVGPathElement;
            gsap.set(underlinePath, { drawSVG: "0%" });

            splitTextTl.fromTo(firstThree, {
                autoAlpha: 0,
                y: -50
            }, {
                autoAlpha: 1,
                y: 0,
                stagger: 0.3,
                ease: "power2.out",
                duration: 0.9
            })
            .fromTo(jordi, {
                autoAlpha: 0,
                scale: 0.5
            }, {
                autoAlpha: 1,
                scale: 1.2,
                duration: 0.6
            }, ">")
            .to(jordi, {
                ease: CustomWiggle.create("tambourineWiggle", {
                    wiggles: 6,
                    type: "easeOut",
                }),
                rotation: 10,
                duration: 0.6,
            }, "<=0.2")
            .to(jordi, {
                scale: 1,
                duration: 0.6,
                ease: "power2.inOut",
            }, ">")
            .fromTo(nextTwo, {
                autoAlpha: 0,
                y: 50
            }, {
                autoAlpha: 1,
                y: 0,
                stagger: 0.3,
                ease: "power2.out",
                duration: 0.9
            }, ">")
            .fromTo(marathon, {
                autoAlpha: 0,
                scale: 0.8
            }, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.9,
                ease: "back.out(2)",
            }, "-=0.6")
            .addLabel("marathonRevealed")
            .to(underlinePath, {
                drawSVG: "100%",
                duration: 0.6,
                ease: "power1.inOut",
            }, "marathonRevealed-=0.5")
            .to(underlinePath, {
                drawSVG: "100% 100%",
                delay: 0.5,
                duration: 0.6,
                ease: "power1.inOut",
            }, "-=0.3")
            .fromTo(last, {
                autoAlpha: 0,
                y: 50,
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                ease: "power2.out",
            }, "marathonRevealed-=0.4")

            const rollingTl = gsap.timeline();
            const rollingTextAnim = rollingTimeAnimRef.current["rolling-time"]?.();
            if (!rollingTextAnim) return;
            rollingTl.add(rollingTextAnim);

            const textGradientTl = gsap.timeline();
            // add "text-gradient-b dark:text-gradient-p" to the classname of calloutText
            textGradientTl.call(() => {
                // clear the splitText
                calloutSplit.revert();
                // set the className to the gradient and let tailwind handle the transition
                gsap.set(calloutText, {
                    className: "callout-text text-gradient-b dark:text-gradient-p transition-colors ease-in-out duration-1500 mb-2.25",
                })
            })

            const fadeInInteractablesTl = gsap.timeline();

            fadeInInteractablesTl.fromTo([kudosBtn, cameraBurst], {
                autoAlpha: 0,
                y: 40,
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                ease: "power2.out",
                stagger: {
                    each: 0.3,
                    from: "start",
                }
            })
            
            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: scopeRef.current,
                    start: "top 70%",
                    end: "bottom 30%",
                    toggleActions: "play pause play pause",
                    fastScrollEnd: true,
                }
             });

            masterTl.add(splitTextTl);
            masterTl.add(rollingTl, ">");
            masterTl.add(textGradientTl, "-=0.5");
            masterTl.add(fadeInInteractablesTl, "<=0.5");

            return () => {
                calloutSplit.revert();
            };
        },
        {scope: scopeRef, dependencies: []}
    );

    const createWordUnderlineSVG = contextSafe((word: HTMLElement): SVGSVGElement => {
        word.querySelectorAll(".marathon-underline").forEach((node) => node.remove());

        gsap.set(word, {
            position: "relative",
            display: "inline-block",
            paddingBottom: "0.16em",
        });

        const wordRect = word.getBoundingClientRect();
        const svgWidth = Math.max(1, Math.round(wordRect.width));
        const stroke = theme === "light" ? "#525252" : "#a1a1a1";
        const strokeWidth = Math.max(2, wordRect.height * 0.045);
        const svgHeight = Math.max(4, Math.ceil(strokeWidth * 2));
        const lineY = svgHeight / 2;

        const underline = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        underline.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
        underline.setAttribute("width", String(svgWidth));
        underline.setAttribute("height", String(svgHeight));
        underline.classList.add("marathon-underline");
        underline.style.position = "absolute";
        underline.style.left = "0";
        underline.style.bottom = "0";
        underline.style.overflow = "visible";
        underline.style.pointerEvents = "none";
        underline.style.display = "block";
        underline.style.width = `${svgWidth}px`;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M0 ${lineY} L${svgWidth} ${lineY}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", stroke);
        path.setAttribute("stroke-width", String(strokeWidth));
        path.setAttribute("stroke-linecap", "round");
        underline.appendChild(path);

        word.appendChild(underline);

        return underline;
    });



    const goTo = (url: string): void => {
        window.open(url, "_blank");
    };

    return (
        <div ref={scopeRef} id={id} className="mt-section callout-marathon-section w-full h-[50svh] flex-center relative mx-4"> 
            <div className="w-280 h-88 mt-section">
                <div className={cn(
                    'relative h-full max-w-185 flex flex-col items-start',
                    calloutGapCN
                )}>
                    <h2 className="callout-text text-text-secondary transition-colors ease-in-out duration-1500">
                        In December 2025, Jordi completed a marathon in
                    </h2>
                    <MarathonRollingTime className={rollingTimeCN} textSize={textSize} widthHeight={widthHeight} animationKey="rolling-time" registerAnimation={registerRollingTimeAnimation}/>
                    <IconButton className="kudos-btn" text="give kudos" icon={ThumbsUp} activeColor="#FC5200" drawBorder={true} autoResize={true} onClick={() => goTo("https://www.strava.com/activities/16668281692")}/>
                </div>
            </div>
            <CameraBurst className="camera-burst hidden md:block absolute bottom-16 lg:right-32 md:right-12" path2Pictures="/images/hero/marathon_pictures" imageCount={10} />
        </div>
    )
}

export default CalloutMarathon