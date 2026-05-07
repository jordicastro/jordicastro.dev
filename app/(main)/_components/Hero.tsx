import PhotoCard from '@/components/PhotoCard'
import { useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react';
import { SplitText, CustomEase, ScrollTrigger } from "gsap/all";

const Hero = ({ id }: { id?: string }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const gridItemIds = ["title", "cards-right", "cards-left", "about"]
    const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
    const isMobile = useMediaQuery("(max-width: 992px)"); // usually 768, but need to start mobile breakpoint earlier
    const sm = useMediaQuery("(max-width: 640px)");

    gsap.registerEffect({
        name: "backOutStagger",
        effect: (targets: gsap.TweenTarget, config?: { duration?: number, scaleFrom?: number, yFrom?: number, stagger?: gsap.TweenVars["stagger"], ease?: gsap.EaseString }) => {
            const tl = gsap.timeline();

            tl.fromTo(targets, {
                autoAlpha: 0,
                scale: config?.scaleFrom || 0.8,
                y: config?.yFrom || 50,
            }, {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                duration: config?.duration || 0.8,
                ease: config?.ease || "back.out",
                stagger: config?.stagger || {
                    each: 0.15,
                    from: "end",
                }
            })

            return tl;
        }
    })

    gsap.registerPlugin(useGSAP, SplitText, CustomEase, ScrollTrigger);

    const { contextSafe } = useGSAP(
        () => {
            setup();

            const titleEl = gsap.utils.selector(scopeRef.current)('.title-el');
            const subtitleEl = gsap.utils.selector(scopeRef.current)('.subtitle-el');
            const photoCards = gsap.utils.selector(scopeRef.current)('.photo-card-wrapper');

            if (!titleEl || !subtitleEl || !photoCards) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: scopeRef.current,
                    start: "top +=20",
                    end: "bottom top",
                    toggleActions: "play complete none none",
                    
                },
                defaults: { ease: "power2.out" },
                onComplete: () => setHasCompletedIntro(true)
            });

            const getDesktopAnimation = () => {
                const desktopTl = gsap.timeline();

                // introducingEl only on desktop on initial load. (local storage to track if hasVisited ?)
                const introducingEl = gsap.utils.selector(scopeRef.current)('.introducing-el');
                const introducingSplit = new SplitText(introducingEl, {
                    type: "lines, chars",
                    mask: "lines"
                });

                desktopTl.call(() => gsap.set(introducingEl, { autoAlpha: 1 }))
                .fromTo(introducingSplit.chars, {
                    autoAlpha: 0,
                    y: 50,
                }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    stagger: {
                        each: 0.04,
                        from: "start",
                    }
                })
                .add(titleAnimation(), ">")
                .add(photoCardsAnimation(), "-=0.2")
                .add(aboutAnimation(), "-=0.3")

                return desktopTl;
            }

            const getMobileAnimation = () => {
                const mobileTl = gsap.timeline();
                
                mobileTl.add(titleAnimation())
                .add(photoCardsAnimation(), "-=0.2")
                // .add(aboutAnimation(), "-=0.3")
                // instead of adding the aboutAnimation, call it so the scrollTrigger is created
                aboutAnimation();
                return mobileTl;
            }

            const titleAnimation = () => { // title & subtitle animation
                const titleTl = gsap.timeline({ defaults: { ease: "power2.out" } });
                const waveColorFrom = "oklch(55.6% 0 0)";

                const titleLineEls = gsap.utils.selector(scopeRef.current)('.title-line-text');
                const titleSplits = titleLineEls.map((line) => new SplitText(line, {
                    type: "chars",
                    charsClass: "title-char",
                }));
                const titleChars = titleSplits.flatMap((split) => split.chars as HTMLElement[]);

                gsap.set(titleChars, { color: waveColorFrom });

                titleTl.call(() => {
                    gsap.set([titleEl, subtitleEl], { autoAlpha: 1 });
                });
                titleSplits.forEach((split, i) => { // animate each line fading up
                    titleTl.fromTo(split.chars, {
                        autoAlpha: 0,
                        y: 50,
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                    }, i === 0 ? ">" : `<=${i * 0.2}`); // stagger lines by 0.2
                });
                titleTl.addLabel("titleFadeInEnd");
                const waveTl = waveAnimation(titleChars);

                if (!isMobile) { // subtitle on Desktop:
                    const emojis = gsap.utils.selector(scopeRef.current)('.emojis > span');
                    const phonetic = gsap.utils.selector(scopeRef.current)('.phonetic');
                    titleTl.to(emojis, { // fan emojis in from left
                        x: 0,
                        duration: 0.8,
                        ease: "back.out",
                        stagger: {
                            each: 0.15,
                            from: "end",
                        }
                    }, "<=0.2")
                    .fromTo(phonetic, { // scale & fade in phonetic
                        autoAlpha: 0,
                        scale: 0.8,
                    }, {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.8,
                    }, "<=0.2");
                } else { // subtitle on Mobile:
                    const subtitleEls = gsap.utils.selector(scopeRef.current)('.subtitle-el > span');
                    titleTl.fromTo(subtitleEls, { // fade subtitle up together
                        autoAlpha: 0,
                        y: 50,
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: {
                            each: 0,
                            from: "start",
                        }
                    }, "-=0.6");
                }
                const insertTime = isMobile ? "titleFadeInEnd+=0.4" : "titleFadeInEnd+=0.4";
                titleTl.call(() => { // call the wave animation in parallel after the title has faded i
                    waveTl.restart(true);
                }, [], insertTime);


                return titleTl;
            }

            const waveAnimation = (titleChars: HTMLElement[]) => {
                const waveColorFrom = "oklch(55.6% 0 0)"; // neutral-500
                const waveColorTo = "oklch(92.2% 0 0)"; // neutral-200
                const stagger: gsap.TweenVars["stagger"] = {
                    each: 0.15,
                    from: "start",
                }
                const duration = 0.5;
                // smooth: 0.15, 0.5
                // quick: 0.08 - 0.4

                const waveTl = gsap.timeline({
                    paused: true,
                    defaults: { ease: "sine.inOut" },
                });

                waveTl.fromTo(titleChars, {
                    color: waveColorFrom,
                }, {
                    color: waveColorTo,
                    duration,
                    stagger,
                    ease: "sine.inOut",
                })
                .fromTo(titleChars, {
                    color: waveColorTo,
                    immediateRender: false,
                }, {
                    color: waveColorFrom,
                    duration,
                    stagger,
                    ease: "sine.inOut",
                    immediateRender: false,
                }, `<=${duration}`)

                return waveTl;
            }

            const photoCardsAnimation = () => {
                const cardsTl = gsap.timeline({ defaults: { ease: "power2.out" } });

                if (!isMobile) { // stagger in right cards, then left cards
                    const rightCards = photoCards.slice(0, 4);
                    const leftCards = photoCards.slice(4, 8);
                    cardsTl.add(gsap.effects.backOutStagger(rightCards));
                    cardsTl.add(gsap.effects.backOutStagger(leftCards), "-=0.6"); 
                } else { // stagger cards in randomly
                    const visiblePhotoCards = photoCards.filter((_, i) => {
                        return i !== 2 && i !== 3 && i !== 6 && i !== 7;
                    });
                    const animatableCards = sm ? visiblePhotoCards : photoCards;
                    cardsTl.add(gsap.effects.backOutStagger(animatableCards, {
                        yFrom: 50,
                        stagger: {
                            each: 0.15,
                            from: "random",
                        }
                    }))
                }

                return cardsTl;
            }

            const aboutAnimation = () => {
                const aboutWrapper = gsap.utils.selector(scopeRef.current)('.about-wrapper')[0];
                const aboutSubtitle = gsap.utils.selector(scopeRef.current)('.about-subtitle');
                const aboutPTags = gsap.utils.selector(scopeRef.current)('.about-ptag');

                const aboutTl = isMobile ? // create a scroll trigger on mobile since its off the screen
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: aboutWrapper,
                            start: "top bottom",
                            invalidateOnRefresh: true,
                        },
                        defaults: { ease: "power2.out" },
                    }) : 
                    gsap.timeline({ defaults: { ease: "power2.out" } });

                aboutTl.call(() => gsap.set(aboutWrapper, { autoAlpha: 1 }))
                .fromTo(aboutSubtitle, {
                    autoAlpha: 0,
                    y: 20,
                }, {
                    autoAlpha: 1,
                    duration: 0.8,
                    y: 0,
                })
                .fromTo(aboutPTags, {
                    autoAlpha: 0,
                    y: 30,
                }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: {
                        each: 0.2,
                        from: "start",
                    }
                }, "<=0.4");


                return aboutTl;
            }

            if (isMobile) {
                tl.add(getMobileAnimation());
            } else {
                tl.add(getDesktopAnimation());
            }

            return () => {
                // titleSplits.forEach((split) => split.revert());
            };
        },
        { scope: scopeRef, dependencies: [] }
    )

    useGSAP( // hook called when the intro animation is complete to start the paralax scroll trigger animation
        () => {
            if (!hasCompletedIntro) return;

            const photoCards = gsap.utils.selector(scopeRef.current)('.photo-card-wrapper');
            if (!photoCards.length) return;

            const parallaxTl = gsap.timeline({
                scrollTrigger: {
                    trigger: scopeRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                },
                defaults: { ease: "none" },
            });

            if (!isMobile) {
                const rightCards = photoCards.slice(0, 4);
                const leftCards = photoCards.slice(4, 8);

                parallaxTl.to(rightCards, {
                    y: 50,
                    stagger: {
                        each: 0.04,
                        from: "end",
                    }
                })
                .to(leftCards, {
                    y: -50,
                    stagger: {
                        each: 0.04,
                        from: "start",
                    }
                }, "");
            } else {
                const visiblePhotoCards = photoCards.filter((_, i) => {
                    return i !== 2 && i !== 3 && i !== 6 && i !== 7;
                });
                const animatableCards = sm ? visiblePhotoCards : photoCards;

                if (animatableCards.length === 8) { // md breakpoint with 8 photoCards
                    const col1 = [animatableCards[2], animatableCards[3]];
                    const col2 = [animatableCards[0], animatableCards[1]];
                    const col3 = [animatableCards[4], animatableCards[5]];
                    const col4 = [animatableCards[6], animatableCards[7]];

                    parallaxTl.to(col1, {
                        y: 30,
                    })
                    .to(col3, {
                        y: 30,
                    }, "<=0.05")
                    .to(col4, {
                        y: -30,
                    }, 0)
                    .to(col2, {
                        y: -30,
                    }, "<=0.05");
                } else { // sm breakpoint with 4 photoCards
                    const col1 = [animatableCards[0], animatableCards[1]];
                    const col2 = [animatableCards[2], animatableCards[3]];

                    parallaxTl.to(col1, {
                        y: -30,
                    })
                    .to(col2, {
                        y: 30,
                    }, "<=0.05");
                }
            }

            return () => {
                parallaxTl.scrollTrigger?.kill();
                parallaxTl.kill();
                gsap.set(photoCards, { clearProps: "transform" });
            };
        },
        { scope: scopeRef, dependencies: [hasCompletedIntro, isMobile, sm, ], revertOnUpdate: true }
    )

    const setup = contextSafe(() => {

        // shared elements
        const titleEl = gsap.utils.selector(scopeRef.current)('.title-el');
        const subtitleEl = gsap.utils.selector(scopeRef.current)('.subtitle-el');
        const photoCards = gsap.utils.selector(scopeRef.current)('.photo-card-wrapper');
        const aboutWrapper = gsap.utils.selector(scopeRef.current)('.about-wrapper');
        if (!titleEl || !subtitleEl || !photoCards || !aboutWrapper) return;
        gsap.set([titleEl, subtitleEl, photoCards, aboutWrapper], { autoAlpha: 0 });
        gsap.set(titleEl, { color: "oklch(55.6% 0 0)" });

        if (!isMobile) { // Desktop elements setup
            const introducingEl = gsap.utils.selector(scopeRef.current)('.introducing-el')[0] as HTMLDivElement | undefined;
            if (!introducingEl ) return;
            gsap.set(introducingEl, { autoAlpha: 0 });
            // emojis left offset for fan animation
            const subtitleRect = subtitleEl[0].getBoundingClientRect();
            const subtitleLeftX = subtitleRect.left;
            const emojis = gsap.utils.selector(scopeRef.current)('.emojis > span');
            emojis.forEach((emoji) => {
                const emojiRect = emoji.getBoundingClientRect();
                gsap.set(emoji, { x: subtitleLeftX - (emojiRect.left + emojiRect.width ) }); // place outside the container (left)
            });

        } else { // make sure about wrapper children are hidden on mobile for scroll trigger animation
            const aboutWrapper = gsap.utils.selector(scopeRef.current)('.about-wrapper')[0];
            const aboutSubtitle = gsap.utils.selector(scopeRef.current)('.about-subtitle');
            const aboutPTags = gsap.utils.selector(scopeRef.current)('.about-ptag');
            if (!aboutWrapper || !aboutSubtitle || !aboutPTags) return;
            gsap.set([aboutWrapper, aboutSubtitle, aboutPTags], { autoAlpha: 0 });
        }
    });

    return (
        <div ref={scopeRef} id={id}>
            {/* Desktop layout */}
            { !isMobile ? (
                <div className="desktop-wrapper h-[calc(100svh-16px)] w-full flex flex-col gap-card overflow-y-hidden">
                    <div className="grid grid-rows-2 grid-cols-2 h-full w-full gap-5 pt-4 pl-0 pr-0">
                        {gridItemIds.map(id => (
                            <HeroGridItem key={id} id={id} />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    {/* mobile layout */}
                    <div className="mobile-wrapper h-auto w-full flex flex-col gap-card overflow-hidden">
                        <div className="h-full w-full flex flex-col items-center justify-start mt-subsection">
                            {/* title */}
                            <div className="flex-center flex-col gap-6">
                                <h1 className="title-el flex flex-col text-center max-w-sm sm:max-w-md text-text-tertiary">
                                    <span className="title-line-text block overflow-hidden whitespace-nowrap">Jordi</span>
                                    <span className="title-line-text block overflow-hidden whitespace-nowrap">Castro</span>
                                </h1>
                                <p className="subtitle-el flex items-center gap-3 text-center overflow-hidden">
                                    <span className="emojis text-2xl">️
                                        🌞
                                    </span>
                                    <span className="phonetic">
                                        /ˈdʒɔr.di ˈkæs.troʊ/
                                    </span>
                                </p>
                            </div>
                            {/* photo cards */}
                                <div className="flex-center w-full h-auto gap-card mt-subsection items-start">
                                    <div className="flex flex-col gap-card mt-20 relative">
                                        <PhotoCard src="/images/hero/chilean-volcano.png" liveSrc="/videos/hero/chilean-volcano.mp4" alt="chilean-volcano" width={185} height={246} className="w-46 h-auto"/>
                                        <PhotoCard src="/images/hero/mangos.png" alt="arbol-de-mangos" width={185} height={246} className="w-46 h-auto"/>
                                        <div className="absolute hidden sm:flex flex-col items-end gap-card -top-10 -left-64 w-60">
                                            <PhotoCard src="/images/hero/playa-del-amor.png" alt="playa-del-amor" width={159} height={238} className="w-45 h-auto"/>
                                            <PhotoCard src="/images/hero/chilean-fjords.png" liveSrc="/videos/hero/chilean-fjords.mp4" alt="chilean-fjords" width={300} height={236} className="w-auto h-auto"/>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-card relative">
                                        <PhotoCard src="/images/hero/bucket-hat-jordi.png" alt="bucket-hat-jordi" width={185} height={246} className="w-46 h-auto"/>
                                        <PhotoCard src="/images/hero/iguaçu-waterfall.png" liveSrc="/videos/hero/iguaçu-waterfall.mp4" alt="iguaçu-waterfall" width={185} height={246} className="w-46 h-auto"/>
                                        <div className="absolute hidden sm:flex flex-col items-start gap-card top-15 -right-53">
                                            <PhotoCard src="/images/hero/coatis.png" liveSrc="/videos/hero/coatis.mp4" alt="coatis" width={186} height={249} className="w-46 h-auto" />
                                            <PhotoCard src="/images/hero/cactus-loscabos.png" alt="cactus-loscabos" width={200} height={249} className="w-49 h-auto" />
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-auto w-3/4 ml-10 flex-center mt-0">
                        <HeroGridItem id="about" />
                    </div>
                </div>
            ) }
        </div>
    )
}

const HeroGridItem = ({ id }: { id: string }) => {
    const aboutPTags = [
        "I graduated from the University of Arkansas (May 2025) with a B.S. in Computer Science and a minor in Mathematics.",
        "I build full-stack applications, using modern frameworks and tools, including React, GSAP, Figma, and MongoDB. These projects range from mobile development to machine learning. ",
        // "I care about how products look and feel, which is why I gathered feedback from 50+ users before launching this website.",
        "Outside of coding, I enjoy running, hiking, and listening to music. I also love traveling and have visited 10 countries so far.",
    ]
    
    if (id === "title") return (
        <div className="hero-grid-item title-wrapper relative overflow-hidden">
            <h4 className="introducing-el absolute top-0 left-15 text-[16px]/[30px]">
                introducing...
            </h4>
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-5 gap-5 text-center">
                <h1 className="title-el inline-grid shrink-0 auto-cols-max text-text-tertiary max-h-md">
                    <span className="title-line-text block overflow-hidden whitespace-nowrap">Jordi</span>
                    <span className="title-line-text block overflow-hidden whitespace-nowrap">Castro</span>
                </h1>
                <p className="subtitle-el flex items-center justify-center gap-3 overflow-hidden">
                    <span className="emojis inline-flex text-2xl tracking-wider">️
                        <span className="inline-block will-change-transform">
                            🌞
                        </span>
                        <span className="inline-block will-change-transform">
                            🌋
                        </span>
                        <span className="inline-block will-change-transform">
                            🥭
                        </span>
                    </span>
                    <span className="phonetic">
                        /ˈdʒɔr.di ˈkæs.troʊ/
                    </span>
                </p>
            </div>
        </div>
    )
    else if (id === "cards-right") return (
        <div className="hero-grid-item relative">
            {/* photo cards wrapper */}
            <div className="flex h-full w-full items-end gap-card overflow-hidden">
                <div className="flex shrink-0 justify-start items-end">
                    <PhotoCard src="/images/hero/chilean-volcano.png" liveSrc="/videos/hero/chilean-volcano.mp4" alt="chilean-volcano" width={185} height={246} className="w-46 h-auto"/>
                </div>
                <div className="flex h-full shrink-0 self-stretch items-end justify-center pb-10">
                    <PhotoCard src="/images/hero/bucket-hat-jordi.png" alt="bucket-hat-jordi" width={227} height={341} className="w-57 h-auto"/>
                </div>
                <div className="relative hidden md:flex shrink-0 flex-col justify-end items-start">
                    <PhotoCard src="/images/hero/playa-del-amor-landscape.png" alt="playa-del-amor-landscape" width={257} height={192} className="w-70 h-auto"/>
                    <PhotoCard src="/images/hero/cactus-loscabos.png" alt="cactus-loscabos" width={162} height={215} className="mt-4 w-40 h-auto"/>
                </div>
            </div>
        </div>
    )
    else if (id === "cards-left") return (
        <div className="hero-grid-item relative">
            <div className="abs-center flex-center items-start w-full h-4/4 gap-card overflow-hidden">
                <div className="flex flex-col gap-4 items-end justify-center shrink-0">
                    <PhotoCard src="/images/hero/mangos.png" alt="arbol-de-mangos" width={185} height={246} className="w-50 h-auto"/>
                    <PhotoCard src="/images/hero/chilean-fjords.png" liveSrc="/videos/hero/chilean-fjords.mp4" alt="chilean-fjords" width={200} height={236} className="w-64 h-auto"/>
                </div>
                    <PhotoCard src="/images/hero/iguaçu-waterfall.png" liveSrc="/videos/hero/iguaçu-waterfall.mp4" alt="iguaçu-waterfall" width={226} height={302} className="mt-10 w-55 h-auto shrink-0"/>
            </div>
        </div>
    )
    else if (id === "about") return (
        <div className="hero-grid-item flex-start">
            <div className="about-wrapper flex flex-col items-start justify-start h-full w-full xl:w-5/8 mt-section">
                <h4 className="about-subtitle">about</h4>
                <div className="flex flex-col gap-ptag">
                    {aboutPTags.map((p, i) => (
                        <p key={i} className="about-ptag">
                            {p}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Hero