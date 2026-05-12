import React, { useCallback, useRef } from 'react'
import { codeTextStyling } from '@/constants/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CustomEase, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, snap } from 'gsap/all';
import { FlourishBuilder, FlourishKey, FlourishRegisterProps } from '@/types/types';
import TypewriterText from '@/components/TypewriterText';

const GitFlourish = ({ flourishKey, register }: FlourishRegisterProps) => {
    const gitFlourish = [
        "git add .",
        "git commit -m \"jordiCastro.dev identity section\"",
        "git push"
    ];
    const scopeRef = useRef<HTMLDivElement>(null);
    const lineBuildersRef = useRef<Record<string, FlourishBuilder>>({});
    const lineSpeed = [0.15, 0.10, 0.20]; // typing speed for each line

    const registerGitLineAnimation = useCallback((key: string, build: FlourishBuilder) => {
        lineBuildersRef.current[key] = build;
    }, []);

    gsap.registerPlugin(useGSAP);

    useGSAP(
        () => {
            register(flourishKey, () => {
                if (!scopeRef.current) return null;
                const root = scopeRef.current;

                const tl = gsap.timeline();
                tl.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: "power2.out" });

                gitFlourish.forEach((_, i) => {
                    const lineTween = lineBuildersRef.current[`git-line-${i + 1}`]?.();
                    let prevLineWrapperEl: HTMLElement | null = null;
                    if (i !== 0) {
                        prevLineWrapperEl = root.querySelector(`.typewriter-line-wrapper-${i}`);
                        if (!prevLineWrapperEl) return;
                    }
                    const lineWrapperEl = root.querySelector(`.typewriter-line-wrapper-${i + 1}`) as HTMLElement | null;
                    if (!lineTween) return;
                    if (!lineWrapperEl) return;
                    const insertTime = i === 0 ? ">-=0.3" : ">+=0.2";
                    const moveUpTime = i === 0 ? ">" : ">+=0.2";
                    tl.add(lineTween, insertTime);
                    const isFinalLine = i === gitFlourish.length - 1;
                    if (!isFinalLine) {
                        tl.to(lineWrapperEl, { y: -75, duration: 0.75, ease: "power3.out" }, moveUpTime);
                        if (prevLineWrapperEl) {
                            tl.to(prevLineWrapperEl, { y: -150, duration: 0.75, ease: "power3.out" }, "<");
                        }
                    }
                });
                // TODO: potentially add a progress bar at the bottom that drawSvgs from 0 to 100% with a rough ease and the progress % next to it, then animate a green checkmark svg onComplete
                return tl;
            });
        },
        {scope: scopeRef, dependencies: [register, flourishKey]}
    );
    return (
        <div ref={scopeRef}className="flourish SE-flourish git-flourish abs-x-center top-32 lg:left-auto lg:translate-x-0 lg:right-64 lg:w-150 sm:w-125 w-112 h-50 flex flex-col items-start justify-center gap-5">
            {gitFlourish.map((line: string, i: number) => (
                <div key={i} className={`absolute bottom-0 left-1/2 -translate-x-1/2 typewriter-line-wrapper-${i + 1}`}>
                    <TypewriterText
                        text={line}
                        codeText={true}
                        parentWidth={600}
                        className='h-auto w-auto'
                        speed={lineSpeed[i]}
                        animationKey={`git-line-${i + 1}`}
                        registerAnimation={registerGitLineAnimation}
                    />
                </div>
            ))}
        </div>
    )
}

const SQLFlourish = ({ flourishKey, register }: FlourishRegisterProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);

    gsap.registerPlugin(useGSAP);

    useGSAP(
        () => {
            register(flourishKey, () => {
                if (!scopeRef.current) return null;
                const root = scopeRef.current;
                // get all the codeText elements
                const codeTextEls = gsap.utils.toArray<HTMLElement>(".code-text", root);
                if (!codeTextEls.length) return null;

                const tl = gsap.timeline();

                codeTextEls.forEach((el, index) => {
                    tl.to(el, {y: -60, duration: 1, ease: "expo.out"}, index * 2)
                    .to(el, {y: -120, duration: 1, ease: "expo.in"}, index * 2 + 1)
                })
                return tl;
            });
        },
        {scope: scopeRef, dependencies: [register, flourishKey]}
    );

    return (
        <div ref={scopeRef} className="flourish SE-flourish sql-flourish hidden xl:flex absolute bottom-40 left-24 w-162 h-18 flex-col items-center justify-start gap-5 overflow-hidden">
            <CodeText className="absolute -bottom-12">
                <div className='text-sky'>
                    SELECT
                </div>
            </CodeText>
            <CodeText className="absolute -bottom-12">
                <div className='text-sky'>
                    <span className='text-yellow'>COUNT</span>
                    <span className='text-neutral-400'>(fo.orderNo) </span>
                    AS
                    <span className='text-neutral-400' > orderCount</span>
                </div>
            </CodeText>
            <CodeText className="absolute -bottom-12">
                <div className='text-sky'>
                    <span className='text-yellow'>AVG</span>
                    <span className='text-neutral-400'>(mi.price) </span>
                    AS
                    <span className='text-neutral-400' > avgBasePrice</span>
                </div>
            </CodeText>
            <CodeText className="absolute -bottom-12">
                <div className='text-sky'>
                    FROM
                    <span className='text-neutral-400'> FoodOrder fo</span>
                </div>
            </CodeText>
            <CodeText className="absolute -bottom-12">
                <div className='text-sky'>
                    JOIN
                    <span className='text-neutral-400'> MenuItem mi </span>
                    ON
                    <span className='text-neutral-400'> mi.itemNo = fo.itemNo</span>
                </div>
            </CodeText>
            <CodeText className="absolute -bottom-12">
                <div className='text-sky'>
                    WHERE
                    <span className='text-neutral-400'> fo.date &gt;=</span>
                    <span className='text-green'> '2024-03-01' </span>
                    AND
                    <span className='text-neutral-400'> fo.date &lt; </span>
                    <span className='text-green'> '2024-04-01' </span>
                </div>
            </CodeText>
        </div>
    )
}

const ReactButtonFlourish = ({ flourishKey, register }: FlourishRegisterProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);

    gsap.registerPlugin(useGSAP, DrawSVGPlugin, CustomEase);
    gsap.registerEffect({
        name: "popIn",
        effect: (targets: gsap.TweenTarget, config: { scaleFrom?: number, scaleTo?: number, duration?: number, ease?: gsap.EaseString | gsap.EaseFunction }) => {
            const tl = gsap.timeline();
            tl.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out" })
            .fromTo(targets, { scale: config.scaleFrom ?? 0.8}, {
                scale: config.scaleTo ?? 1,
                ease: config.ease ?? CustomEase.create("popIn", "M0,0 C0.046,0.091 0.35,0.895 0.5,1.1 0.789,0.822 0.72,0.895 1,1 "),
                duration: config.duration ?? 0.5,
            }, "<");
            return tl;
        }
    })

    useGSAP(
        () => {
            register(flourishKey, () => {
                if (!scopeRef.current) return null;
                const root = scopeRef.current;
    
                const codeEl = root.querySelector(".code-el") as HTMLElement | null;
                if (!codeEl) return null;
                const reactBtn = root.querySelector(".react-btn") as HTMLElement | null;
                if (!reactBtn) return null;
                const btnBorderPath = root.querySelector("#react-btn-border-path") as SVGPathElement | null;
                if (!btnBorderPath) return null;
                const gradientEl = root.querySelector("#borderGradient") as SVGLinearGradientElement | null;
                if (!gradientEl) return null;
                
                // setup
                gsap.set(btnBorderPath, { drawSVG: "0%" });
                // spin gradient via a proxy
                const proxy = { angle: 0 };
                
                const tl = gsap.timeline();
                // 1: reveal the code
                tl.add(gsap.effects.popIn(codeEl))
                // 2: reveal the button, then draw the border and spin the gradient
                .add(gsap.effects.popIn(reactBtn), "<=0.25")
                .to(btnBorderPath, {
                    drawSVG: "100%",
                    duration: 1.5,
                    delay: 0.5,
                    ease: "power1.inOut",
                }, "<")
                .to(proxy, {
                    angle: 360,
                    duration: 6,
                    repeat: 1,
                    ease: "none",
                    onUpdate: () => {
                        // 130, 27 = center of the 260×54 viewBox
                        gradientEl.setAttribute("gradientTransform", `rotate(${proxy.angle}, 130, 27)`);
                    },
                }, "<");
                
                return tl;
            });
        },
        {scope: scopeRef, dependencies: [register, flourishKey] }
    );
    
    return ( // lg:right-72
        <div ref={scopeRef}className='flourish SE-flourish abs-x-center lg:left-auto lg:translate-x-0 bottom-14 lg:right-32 2xl:right-64 w-105 h-72 flex flex-col items-center gap-y-12.5'>
            {/* jsx code */}
            <div className='code-el w-95 lg:w-103.75 h-46 bg-neutral-100 dark:bg-neutral-900 rounded-3xl py-6 px-12 text-[16px] sm:text-[16px] lg:text-[18px] font-mono text-neutral-400 text-start flex flex-col gap-y-0.5'>
                <div>
                    <span className='text-purple'>const </span>
                    <span className='text-sky'>Button = </span>
                    <span className='text-yellow'>() </span>
                    <span className='text-purple'>=&gt; </span>
                    <span className='text-yellow'>(</span>
                </div>
                <div className='ml-10'>
                    &lt;
                    <span className='text-red'>button </span>
                    <span className='text-orange'>className</span>
                    =
                    <span className='text-green'>"btn"</span>
                    &gt;
                </div>
                <div className='ml-20 text-text-primary'>
                    Deploy
                </div>
                <div className='ml-10'>
                    &lt;/
                    <span className='text-red'>button</span>
                    &gt;
                </div>
                <div>
                    <span className='text-yellow'>)</span>
                </div>
            </div>
            {/* button */}
            <div className='react-btn relative border-wrapper'>
                <div className='w-62.5 h-12.5 rounded-full flex-center bg-neutral-100 dark:bg-neutral-900 shadow-[0_8px_24px_rgba(15,23,42,0.12)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]'>
                    <p className='text-text-primary tracking-[0.2em] font-semibold'>
                        Deploy
                    </p>
                </div>
                <svg
                    className='abs-center'
                    width="260"
                    height="54"
                    viewBox="0 0 260 54"
                    fill="none"
                >
                    <defs>
                        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
                            <stop offset="0%"   stopColor="#FDC204" />
                            <stop offset="33%"  stopColor="#F96C7F" />
                            <stop offset="66%"  stopColor="#4A9E2F" />
                            <stop offset="100%" stopColor="#FDC204" />
                        </linearGradient>
                    </defs>
                    <path
                        id="react-btn-border-path"
                        d="M27 2 H233 A25 25 0 0 1 233 52 H27 A25 25 0 0 1 27 2 Z"
                        fill="none"
                        stroke="url(#borderGradient)"
                        strokeWidth="3"
                    />
                </svg>
            </div>
        </div>
    )
}

const TagFlourish = ({ flourishKey, register }: FlourishRegisterProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);

    gsap.registerPlugin(useGSAP);
    useGSAP(
        () => {
            register(flourishKey, () => {
                if (!scopeRef.current) return null;
                const root = scopeRef.current;

                gsap.set(root, { rotate: -25, autoAlpha: 0 });
                const masterTL = gsap.timeline();
                masterTL.to(root, { autoAlpha: 1, duration: 0.25 })
                const tl = gsap.timeline({ repeat: 9, yoyo: true });
                tl.to(root, { rotate: 25, duration: 0.75, ease: snap(1) })
                masterTL.add(tl);
                return masterTL;
            });
        },
        {scope: scopeRef, dependencies: [] }
    );

    return (
        <div ref={scopeRef} className='flourish SE-flourish hidden lg:block absolute left-36 top-72'>
            <span className='text-3xl font-mono font-extrabold tracking-normal text-neutral-300'>&lt;/&gt;</span>
        </div>
    )
}

interface CodeTextProps {
    children: React.ReactNode;
    className?: string;
}

const CodeText = ({ children, className }: CodeTextProps) => {
    return (
        <div className={`code-text h-auto w-auto ${codeTextStyling} ${className ?? ""}`}>
            {children}
        </div>
    )
}

export { GitFlourish, SQLFlourish, ReactButtonFlourish, TagFlourish };