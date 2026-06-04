import React, { useCallback, useRef } from 'react'
import { codeTextStyling } from '@/constants/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CustomEase, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, snap } from 'gsap/all';
import { FlourishBuilder, FlourishKey, FlourishRegisterProps } from '@/types/types';
import TypewriterText from '@/components/TypewriterText';
import { CarouselCorner, ProgressBar } from '@/components/svgs/svgs';
import { cn } from '@/lib/utils';
import { CornerDownLeft } from 'lucide-react';
import Image from 'next/image';

const GitFlourish = ({ flourishKey, register }: FlourishRegisterProps) => {
    const gitFlourish = [
        "git add .",
        "git commit -m \"jordiCastro.dev identity section\"",
        "git push"
    ];
    const scopeRef = useRef<HTMLDivElement>(null);
    const lineBuildersRef = useRef<Record<string, FlourishBuilder>>({});
    const lineSpeed = [0.15, 0.09, 0.20]; // typing speed for each line

    const registerGitLineAnimation = useCallback((key: string, build: FlourishBuilder) => {
        lineBuildersRef.current[key] = build;
    }, []);

    gsap.registerPlugin(useGSAP, DrawSVGPlugin);

    useGSAP(
        () => {
            register(flourishKey, () => {
                if (!scopeRef.current) return null;
                const root = scopeRef.current;
                const progressWrapper = gsap.utils.selector(root)(".progress-wrapper")[0] as HTMLElement | null;
                const progressPath = gsap.utils.toArray<SVGPathElement>(".git-progress-path", root)[0] as SVGPathElement | null;
                const progressPercent = gsap.utils.selector(root)(".progress-percent")[0] as HTMLElement | null;
                if (!progressWrapper || !progressPath || !progressPercent) return null;

                gsap.set(progressWrapper, { autoAlpha: 0 });
                gsap.set(progressPath, { drawSVG: "0%" });
                const setProgressText = gsap.quickSetter(progressPercent, "textContent");
                setProgressText("0%");

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
                tl.to(progressWrapper, { autoAlpha: 1, duration: 0.5 }, ">+=0.3")
                .to(progressPath, {
                    drawSVG: "100%",
                    duration: 2.5,
                    ease: CustomEase.create("custom", "M0,0 C0.173,0 0.242,0.036 0.322,0.13 0.401,0.223 0.393,0.506 0.502,0.506 0.599,0.506 0.62,0.824 0.726,0.916 0.799,0.98 0.869,1 1,1 "),
                    onUpdate: function (this: gsap.core.Tween) {
                        const percent = Math.round(gsap.utils.clamp(0, 1, this.ratio) * 100);
                        setProgressText(`${percent}%`);
                    },
                    onComplete: () => {
                        gsap.delayedCall(1.1, () => { setProgressText("0%"); })
                    }
                }, "-=0.3");

                return tl;
            });
        },
        {scope: scopeRef, dependencies: [register, flourishKey]}
    );
    return (
        <div ref={scopeRef}className="flourish SE-flourish git-flourish abs-x-center top-18 sm:top-24 lg:left-auto lg:translate-x-0 lg:right-64 lg:w-150 sm:w-125 w-112 h-50 flex flex-col items-start justify-center gap-5">

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
            <div className="progress-wrapper abs-x-center -bottom-12 w-auto h-auto flex-center gap-2">
                {/* progress bar */}
                <ProgressBar color="orange" className="git-progress-bar" />
                {/* progress % */}
                <span className="progress-percent abs-y-center -right-12 text-sm font-mono text-text-secondary">
                    0%
                </span>
            </div>
        </div>
    )
}

type sqlTableRow = {
    title: string;
    rating: number;
    year: number;
    gross_revenue: string;
}

const SQLFlourish = ({ flourishKey, register }: FlourishRegisterProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const tableHeader = ["Title", "Rating", "Year", "Revenue"];
    const tableItemCN = "font-mono text-sm text-text-secondary";
    const tableRowCN = "grid grid-cols-4 items-center rounded-md px-2 py-1.5 transition-colors duration-250 ease-out";
    const tableHeaderCellCN = "font-mono text-xs uppercase tracking-wide text-text-tertiary py-2";
    const sqlTableData: sqlTableRow[] = [
        {
            title: "Endgame",
            rating: 9.0,
            year: 2019,
            gross_revenue: "$2.8B"
        },
        {
            title: "Dark Knight",
            rating: 9.4,
            year: 2008,
            gross_revenue: "$1B"
        },
        {
            title: "Interstellar",
            rating: 8.7,
            year: 2014,
            gross_revenue: "$571M"
        }, {
            title: "Whiplash",
            rating: 9.4,
            year: 2014,
            gross_revenue: "$50M"
        },
    ]

    gsap.registerPlugin(useGSAP);

    useGSAP(
        () => {
            register(flourishKey, () => {
                if (!scopeRef.current) return null;
                const root = scopeRef.current;
                const sqlInputArea = gsap.utils.selector(root)(".sql-input-area")[0] as HTMLElement | null;
                const placeholderText = gsap.utils.selector(root)(".placeholder-text")[0] as HTMLElement | null;
                const sqlSubmitBtn = gsap.utils.selector(root)(".sql-submit-btn")[0] as HTMLElement | null;
                const submitIcon = gsap.utils.selector(sqlSubmitBtn)?.(".submit-icon")[0] as HTMLElement | null;
                const sqlCodeLines = gsap.utils.toArray<HTMLElement>(".sql-code-text", root);

                const sqlTable = gsap.utils.selector(root)(".sql-table")[0] as HTMLElement | null;
                const sqlTableHeader = gsap.utils.selector(root)(".sql-table-row-header")[0] as HTMLElement | null;
                const sqlTableRows = gsap.utils.toArray<HTMLElement>(".sql-table-row", root);

                if (!sqlInputArea || !placeholderText || !sqlSubmitBtn || !submitIcon || !sqlCodeLines || !sqlTable || !sqlTableHeader || !sqlTableRows) return null;

                const setup = () => {
                    gsap.set([root, placeholderText, sqlSubmitBtn, sqlCodeLines, sqlTable], { autoAlpha: 0 });
                    gsap.set(submitIcon, { color: "#525252" })
                    // init dimensions w-[350px] h-[48px]
                    gsap.set(sqlInputArea, { width: 350, height: 48, borderRadius: 8 });
                }
                setup();

                const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 0.8 } })
                .fromTo(root, {
                    autoAlpha: 0,
                    scale: 1.05,
                    y: 20
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                })
                .to(placeholderText, { autoAlpha: 1 }, "<=0.2")
                .to(sqlSubmitBtn, { autoAlpha: 0.2 }, "<=0.25")
                .to(placeholderText, { autoAlpha: 0, duration: 0.5 }, ">=1")
                .to(sqlInputArea, { height: "100%", duration: 2.5, ease: "power2.out" }, "<")
                .fromTo(sqlCodeLines, {
                    autoAlpha: 0,
                    scale: 0.8,
                    y: 20
                }, {
                    autoAlpha: 1,
                    stagger: {
                        each: 0.3,
                        from: "start"
                    },
                    scale: 1,
                    y: 0,
                    ease: "back.out(1.7)"
                }, "<=0.3")
                .to(sqlSubmitBtn, { autoAlpha: 1, ease: "power2.out" }, "-=0.5")
                .to(submitIcon, { color: "#155dfc", ease: "power2.out" }, "<")
                .to(sqlSubmitBtn, { scale: 1.2, ease: "power2.out", duration: 0.2}, ">=1.5")
                .to(sqlSubmitBtn, { scale: 1, ease: "power2.out", duration: 0.2}, ">=0.1")
                .to(sqlInputArea, {
                    autoAlpha: 0,
                    scale: 0.8,
                    ease: "back.in(2)"
                }, "-=0.1")
                .fromTo(sqlTable, {
                    autoAlpha: 0,
                    scale:0.8,
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    ease: "back.out(2)"
                }, "-=0.2")
                .fromTo(sqlTableHeader, {
                    autoAlpha: 0,
                    scale: 0.9
                } ,{
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }, "<=0.3")
                .fromTo(sqlTableRows, {
                    autoAlpha: 0,
                    scale: 0.9,
                    y: 10
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    y: 0,
                    stagger: {
                        each: 0.2,
                        from: "start"
                    },
                    duration: 0.6,
                }, "<=0.2")
                // delay, click the submit button, then same scale ease as the identity transitions to fade out sql and fade in the table, smooooth


                return tl;
            });
        },
        {scope: scopeRef, dependencies: [register, flourishKey]}
    );

    return (
        <div ref={scopeRef} className="flourish SE-flourish sql-flourish hidden lg2:flex justify-center absolute bottom-14 left-24 w-112.5 h-[250px]">
            <div className="relative sql-input-area w-87.5 h-full bg-bg-secondary border-2 border-neutral-300 dark:border-neutral-800 rounded-lg flex flex-col items-start justify-start gap-3 px-3 py-0.5">
                <p className="placeholder-text absolute left-3 top-2.5 text-text-tertiary font-mono">
                    Enter SQL Query...
                </p>
                <div className="sql-submit-btn absolute right-3 top-1.5 w-12 h-8 rounded-lg flex-center bg-bg-primary">
                    <CornerDownLeft size={24} className="submit-icon text-neutral-600" />
                </div>
                {/* the sql lines */}
                <SQLCodeText>
                    <span className="text-blue">SELECT</span>
                    &nbsp;
                    <span>*</span>
                </SQLCodeText>
                <SQLCodeText>
                    <span className="text-blue">FROM</span>
                    &nbsp;
                    <span className="text-orange">movies</span>
                </SQLCodeText>
                <SQLCodeText>
                    <span className="text-blue">WHERE</span>
                    &nbsp;
                    <span className="text-purple">rating</span>
                    &nbsp;
                    <span className="text-blue">&gt;=</span>
                    &nbsp;
                    <span className="text-green">8.5</span>
                </SQLCodeText>
                <SQLCodeText>
                    <span className="text-blue">ORDER BY</span>
                    &nbsp;
                    <span className="text-purple">gross_revenue</span>
                    &nbsp;
                    <span className="text-blue">DESC</span>
                </SQLCodeText>
            </div>
            {/* sql table */}
            <div
                className={cn(
                    "sql-table absolute inset-0 w-full h-full bg-bg-secondary border-2 border-neutral-300 dark:border-neutral-800 rounded-xl",
                    "flex flex-col gap-2 px-3 py-2",
            )}>
                <div className={cn("sql-table-row-header", tableRowCN, "bg-bg-primary") }>
                    {tableHeader.map((header, i) => (
                        <div key={i} className={tableHeaderCellCN}>
                            {header}
                        </div>
                    ))}
                </div>
                {sqlTableData.map((row, i) => (
                    <div
                        key={i}
                        className={cn(
                            "sql-table-row",
                            tableRowCN,
                            "hover:bg-bg-primary/70 transition-colors duration-250 ease-out",
                            i % 2 === 0 && "bg-bg-tertiary/25"
                        )}
                    >
                        <div className={tableItemCN}>
                            {row.title}
                        </div>
                        <div className={tableItemCN}>
                            {row.rating}
                        </div>
                        <div className={tableItemCN}>
                            {row.year}
                        </div>
                        <div className={tableItemCN}>
                            {row.gross_revenue}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const SQLCodeText = ({ children, className }: CodeTextProps) => {
    return (
        <CodeText className={cn(
            "sql-code-text bg-bg-primary! p-3! sm:text-[14px] lg:text-[14px] text-sm! text-text-tertiary",
            className
        )}>
            {children}
        </CodeText>
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
        <div ref={scopeRef}className='flourish SE-flourish abs-x-center lg:left-auto lg:translate-x-0 bottom-4 sm:-bottom-2 2xl:bottom-3 lg:right-32 2xl:right-64 w-105 h-72 flex flex-col items-center gap-6 sm:gap-y-6'>
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

type CarouselLogo = {
    id: string;
    src: string;
    background?: boolean;
    className?: string;
}

const SE_LOGOS_LOOP_TL_ID = "se-logos-carousel-loop";

const LogosFlourish = ({ flourishKey, register, className }: FlourishRegisterProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const carouselTl = useRef<gsap.core.Timeline | null>(null);
    const logosL: CarouselLogo[] = [
        { id: "nextjs", src: "nextjs.png"},
        { id: "typescript", src: "typescript.png"},
        { id: "python", src: "python-2.png", background: true},
        { id: "java", src: "java.png", background: true},
        { id: "pytorch", src: "pytorch.png", background: true},
    ]
    const logosR: CarouselLogo[] = [
        { id: "tailwind", src: "tailwind.png", background: true},
        { id: "react", src: "react.png", background: true},
        { id: "docker", src: "docker.png", background: true},
        { id: "androidstudio", src: "androidstudio.png"},
        { id: "swiftui", src: "swiftui.png"},
    ]

    const getOrderedLogos = (root: HTMLElement, selector: string) =>
        gsap
            .utils
            .toArray<HTMLElement>(selector, root)
            .sort((a, b) => Number(a.dataset.order ?? 0) - Number(b.dataset.order ?? 0));

    gsap.registerPlugin(useGSAP, DrawSVGPlugin, MotionPathPlugin);
    const { contextSafe } = useGSAP(
        () => {
            register(flourishKey, () => {
                if (!scopeRef.current) return null;
                const root = scopeRef.current;
                const leftCarouselPath = root.querySelector("#carousel-corner-path-L") as SVGPathElement | null;
                const rightCarouselPath = root.querySelector("#carousel-corner-path-R") as SVGPathElement | null;
                const carouselLogosL = getOrderedLogos(root, ".carousel-logo-L");
                const carouselLogosR = getOrderedLogos(root, ".carousel-logo-R");
                const leftCarouselLayer = root.querySelector(".carousel-layer-L") as HTMLElement | null;
                const rightCarouselLayer = root.querySelector(".carousel-layer-R") as HTMLElement | null;

                if (!leftCarouselPath || !rightCarouselPath || carouselLogosL.length === 0 || carouselLogosR.length === 0 || !leftCarouselLayer || !rightCarouselLayer) return null;

                carouselTl.current?.kill();
                carouselTl.current = null;
                gsap.set(root, { autoAlpha: 0 });
                // setup icon positions
                setup();

                const fadeInTl = gsap.timeline()
                .call(() => {
                    setup() 
                    carouselTl.current?.pause(0);
                })
                .to(root, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });

                carouselLogosL.forEach((logo, i) => {
                    const stagger = i === 0 ? "<=0.3" : "<=0.05";

                    fadeInTl.fromTo(logo, {
                        autoAlpha: 0,
                        y: "+=20",
                        x: "+=20"
                    }, {
                        autoAlpha: 1,
                        y: "-=20",
                        x: "-=20",
                        duration: 0.5,
                        ease: "back.out(1.7)",
                    }, stagger);
                })
                carouselLogosR.forEach((logo, i) => {
                    const stagger = i === 0 ? "<=0.05" : "<=0.05";

                    fadeInTl.fromTo(logo, {
                        autoAlpha: 0,
                        y: "-=20",
                        x: "-=20"
                    }, {
                        autoAlpha: 1,
                        y: "+=20",
                        x: "+=20",
                        duration: 0.5,
                        ease: "back.out(1.7)",
                    }, stagger);
                })
                
                carouselTl.current = gsap.timeline({ paused: true, id: SE_LOGOS_LOOP_TL_ID });
                carouselLogosL.forEach((logo, i) => {
                    const position = (i * .20) + .10;
                    moveLogo({ logo, position, side: "left" });
                });
                carouselLogosR.forEach((logo, i) => {
                    const position = (i * .20) + .10;
                    moveLogo({ logo, position, side: "right" });
                });

                const masterTl = gsap.timeline();
                masterTl.add(fadeInTl);
                masterTl.call(() => {
                    carouselTl.current?.play(0);
                }, [], ">");

                return masterTl;
            });
        },
        {scope: scopeRef, dependencies: [] }
    );

    const setup = contextSafe(() => {
        if (!scopeRef.current) return;
        const root = scopeRef.current;
        const leftCarouselPath = root.querySelector("#carousel-corner-path-L") as SVGPathElement | null;
        const carouselLogosL = getOrderedLogos(root, ".carousel-logo-L");
        const rightCarouselPath = root.querySelector("#carousel-corner-path-R") as SVGPathElement | null;
        const carouselLogosR = getOrderedLogos(root, ".carousel-logo-R");
        const leftCarouselLayer = root.querySelector(".carousel-layer-L") as HTMLElement | null;
        const rightCarouselLayer = root.querySelector(".carousel-layer-R") as HTMLElement | null;

        if (!leftCarouselPath || !rightCarouselPath || carouselLogosL.length === 0 || carouselLogosR.length === 0 || !leftCarouselLayer || !rightCarouselLayer) return;

        // Restore each logo to its home masked layer before re-seeding positions.
        carouselLogosL.forEach((logo) => {
            if (logo.parentElement !== leftCarouselLayer) {
                leftCarouselLayer.appendChild(logo);
            }
        });
        carouselLogosR.forEach((logo) => {
            if (logo.parentElement !== rightCarouselLayer) {
                rightCarouselLayer.appendChild(logo);
            }
        });

        // place 5 logos evenly along the path, every 20% with 10% start and end gap
        const setLogoPositions = (path: SVGPathElement, logos: HTMLElement[], side: "left" | "right") => {
            logos.forEach((logo, i) => {
                const position = (i * .20) + .10;
                const autoRotate = side === "left" ? true : 180; // flip logo on right for correct orientation (fix: upside down)
    
                gsap.set(logo, {
                    motionPath: {
                        path,
                        align: path,
                        alignOrigin: [0.5, 0.5],
                        autoRotate,
                        start: position,
                        end: position,
                    },
                    zIndex: 20 // ensure all logos are in the same plane
                })
            });
        }

        setLogoPositions(leftCarouselPath, carouselLogosL, "left");
        setLogoPositions(rightCarouselPath, carouselLogosR, "right");
    
    });

    const moveLogo = contextSafe(({ logo, position, side }: { logo: HTMLElement, position: number, side: "left" | "right" }) => {
        if (!scopeRef.current) return;
        const root = scopeRef.current;
        const leftCarouselPath = root.querySelector("#carousel-corner-path-L") as SVGPathElement | null;
        const rightCarouselPath = root.querySelector("#carousel-corner-path-R") as SVGPathElement | null;
        const leftCarouselLayer = root.querySelector(".carousel-layer-L") as HTMLElement | null;
        const rightCarouselLayer = root.querySelector(".carousel-layer-R") as HTMLElement | null;
        if (!leftCarouselPath || !rightCarouselPath || !leftCarouselLayer || !rightCarouselLayer) return;

        // create 2 segments, where 0...1 and 1...2 are the left and right progresses respectively
        const totalSegments = 2;
        const perPathDuration = 8;
        const initialCombinedPosition = side === "left" ? position : position + 1;
        const progressProxy = { value: initialCombinedPosition };

        carouselTl.current?.to(progressProxy, {
            value: initialCombinedPosition + totalSegments,
            duration: perPathDuration * totalSegments,
            ease: "none",
            repeat: -1,
            onUpdate: () => {
                // wrap from 2.0 (end of right) back to 0.0 (start of left)
                const wrappedCombinedPosition = gsap.utils.wrap(0, totalSegments, progressProxy.value);
                // snap from left to right path at progress = 1.0
                const isOnLeftPath = wrappedCombinedPosition < 1;
                const activePath = isOnLeftPath ? leftCarouselPath : rightCarouselPath;
                const activeLayer = isOnLeftPath ? leftCarouselLayer : rightCarouselLayer;
                const pathProgress = isOnLeftPath ? wrappedCombinedPosition : wrappedCombinedPosition - 1;
                const autoRotate = isOnLeftPath ? true : 180; // fix logo orientation on right path (thank you gsap)

                // update logo parent so it can be correctly masked by the parent layer
                if (logo.parentElement !== activeLayer) {
                    activeLayer.appendChild(logo);
                }

                gsap.set(logo, {
                    motionPath: {
                        path: activePath,
                        align: activePath,
                        alignOrigin: [0.5, 0.5],
                        autoRotate,
                        start: pathProgress,
                        end: pathProgress,
                    }
                });
            },
        }, 0);
    });

    return (
        <div
            ref={scopeRef}
            className={cn(
                'flourish SE-flourish hidden xl:block',
                className
        )}>
            {/* left carousel */}
            <div className="absolute -top-14 -left-21 w-35 h-35 pointer-events-none overflow-hidden">
                <div className="carousel-layer-L absolute top-5 left-5 w-auto h-auto">
                    <CarouselCorner className="opacity-0" pathId="carousel-corner-path-L" />
                    {logosL.map((logo, i) => (
                        <CarouselLogo
                            key={i}
                            id={logo.id}
                            src={logo.src}
                            background={logo.background}
                            order={i}
                            className={cn(
                                'carousel-logo-L',
                                logo.className
                        )}/>
                    ))}
                </div>
            </div>
            {/* right carousel */}
            <div className="absolute -bottom-14 -right-21 w-35 h-35 pointer-events-none overflow-hidden">
                <div className="carousel-layer-R absolute bottom-5 right-5 w-auto h-auto">
                    <CarouselCorner className="opacity-0 rotate-180" pathId="carousel-corner-path-R" />
                    {logosR.map((logo, i) => (
                        <CarouselLogo
                            key={i}
                            id={logo.id}
                            src={logo.src}
                            background={logo.background}
                            order={i}
                            className={cn(
                                'carousel-logo-R',
                                logo.className
                        )}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface CarouselLogoProps {
    id: string;
    src: string;
    className?: string;
    background?: boolean;
    order: number;
}

const CarouselLogo = ({ id, src, className, background, order }: CarouselLogoProps) => {
    return (
        <Image
            src={`/images/logos/carousel/${src}`}
            alt={`${id} logo`}
            width={40}
            height={40}
            data-order={order}
            className={cn(
                "carousel-logo w-10 h-10 absolute top-0 left-0 rounded-md select-none pointer-events-none",
                className,
                background ? "bg-bg-primary" : ""
            )}
        />
    )
}

interface CodeTextProps {
    children: React.ReactNode;
    className?: string;
}

const CodeText = ({ children, className }: CodeTextProps) => {
    return (
        <div className={cn(
            "code-text h-auto w-auto",
            codeTextStyling,
            className
        )}>
            {children}
        </div>
    )
}

export { GitFlourish, SQLFlourish, ReactButtonFlourish, LogosFlourish };