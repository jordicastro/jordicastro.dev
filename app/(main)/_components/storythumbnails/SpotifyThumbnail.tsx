"use client"

import { StoryThumbnailProps } from "@/types/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/all";
import { useEffect, useRef, useState } from 'react';
import { Home, ListMusic, Search, ChevronLeft, ChevronRight, Play, Shuffle, CirclePlus, Verified, Ellipsis } from "lucide-react";
import Image from "next/image";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, Flip);

const srcPath = "/images/stories/spotify/"

type Track = {
    title: string;
    duration: string;
}

type Album = {
    src: string;
    title: string;
    artist: string;
}

const SpotifyThumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
    const scope = useRef<HTMLDivElement>(null);
    const THRESHOLD = 350;
    // debounced container width observer to determine whether both mobile and desktop thumbnails fit or just the desktop thumb
    const [shouldShowMobile, setShouldShowMobile] = useState(false);
    const flipStateRef = useRef<Flip.FlipState | null>(null);

    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;
            const element = root;

            // a quicker debounce to avoid too big of a delay
            const debounce = gsap.delayedCall(0.15, update).pause();

            function update() {
                // capture Flip state before updating DOM
                const spotifyWrappers = gsap.utils.toArray(".spotify-wrapper", element) as HTMLElement[];
                if (!spotifyWrappers) return;
                flipStateRef.current = Flip.getState(spotifyWrappers, {
                    props: "transform, width, height, x, y, opacity, scale",
                });
                element.offsetWidth > THRESHOLD ?
                    setShouldShowMobile(true) :
                    setShouldShowMobile(false);
                // console.log('updating container width: ',element.offsetWidth);
            }

            const resizeObserver = new ResizeObserver(() => {
                // console.log('restarting with new size: ', element.offsetWidth);
                debounce.restart(true);
            });

            update();
            resizeObserver.observe(element);

            return () => {
                resizeObserver.disconnect();
                debounce.kill();
            };

        },
        {scope, dependencies: []}
    );

    useGSAP(
        () => {
            if (!flipStateRef.current) return;

            Flip.from(flipStateRef.current, {
                duration: 0.6,
                ease: "power1.inOut",
                nested: true,
                onEnter: (elements) => {
                    gsap.fromTo(
                        elements,
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.6 }
                    )
                },
                onLeave: (elements) => {
                    gsap.to(
                        elements,
                        { opacity: 0, scale: 0.95, duration: 0.6 }
                    )
                },
                clearProps: "transform, width, height, x, y, opacity, scale"
            });
            // reset state
            flipStateRef.current = null;
        },
        {scope, dependencies: [shouldShowMobile]}
    )

    
    return (
        <div ref={scope} className="relative w-full h-full flex-center pb-0 gap-4 select-none">
            <SpotifyMobile hidden={!shouldShowMobile} shouldPlayThumbnail={!!shouldPlayThumbnail}/>
            <SpotifyDesktop shouldPlayThumbnail={!!shouldPlayThumbnail} />
        </div>
    )
}

const SpotifyMobile = ({hidden, shouldPlayThumbnail}: {hidden: boolean, shouldPlayThumbnail: boolean}) => {
    const newReleases: Album[] = [
        { src: "the-cure.png", title: "the cure", artist: "Olivia Rodrigo" },
        { src: "donde-es-el-after.png", title: "¿Dónde Es El After?", artist: "Rawayana" },
        { src: "apambichao.png", title: "Apambichao", artist: "Manuel Turizo" },
        { src: "instrucciones-para-ser-feliz.png", title: "Instrucciones Para Ser Feliz", artist: "Monsieur Periné" },
        { src: "por-si-manana-no-estoy.png", title: "POR SI MAÑANA NO ESTOY", artist: "Omar Courtz" },
        { src: "corsa.png", title: "CORSA", artist: "Eladio Carrion" },
        { src: "el-baifo.png", title: "EL BAIFO", artist: "Quevedo" },
        { src: "loco-x-volver.png", title: "Loco X Volver", artist: "Maluma" },
    ]
    const scope = useRef<HTMLDivElement>(null);
    const masterTl = useRef<gsap.core.Timeline | null>(null);
    const fadeInTl = useRef<gsap.core.Timeline | null>(null);
    const scrollTl = useRef<gsap.core.Timeline | null>(null);
    const shouldPlayRef = useRef(shouldPlayThumbnail);

    useEffect(() => {
        shouldPlayRef.current = shouldPlayThumbnail;

        if (shouldPlayThumbnail) {
            if (masterTl.current && masterTl.current.progress() < 1) {
                masterTl.current.play();
            } else if (scrollTl.current) {
                if (scrollTl.current.progress() === 1) {
                    scrollTl.current.restart();
                } else {
                    scrollTl.current.play();
                }
            }
        } else {
            masterTl.current?.pause(0);
            scrollTl.current?.pause(0);
        }
    }, [shouldPlayThumbnail])

    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;
            const releasesTitle = gsap.utils.toArray(".releases-title", root)[0] as HTMLElement;
            const releasesGrid = gsap.utils.toArray(".releases-grid-wrapper", root)[0] as HTMLElement;
            const releaseCards = gsap.utils.toArray(".release-card", root) as HTMLElement[];
            const scrollable = gsap.utils.toArray(".scrollable", root) as HTMLElement[];

            if (!releasesTitle || !releasesGrid || !releaseCards || !scrollable) return;

            gsap.set([root, releasesTitle, releaseCards], { autoAlpha: 0 });

            const getFadeInTimeline = () => {
                const tl = gsap.timeline({ defaults: { ease: "power1.out", duration: 0.6 } })
                .fromTo(root, {
                    autoAlpha: 0,
                    scale: 0.9
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }, 0.3)
                .fromTo(releasesTitle, {
                    autoAlpha: 0,
                    y: 10   
                }, {
                    autoAlpha: 1,
                    y: 0,
                }, "<=0.3")
                .fromTo(releaseCards, {
                    autoAlpha: 0,
                    scale: 0.95,
                    y: 10
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    y: 0,
                    stagger: {
                        each: 0.08,
                        from: "start"
                    }
                }, "-=0.3");

                return tl;
            }

            const getScrollTimeline = () => {
                const tl = gsap.timeline({
                    paused: true,
                    defaults: { ease: "elastic.out(1.25,1)", duration: 3, delay: 1.5 },
                    onComplete: () => {
                        if (scrollTl.current && shouldPlayRef.current) {
                            scrollTl.current.restart();
                        }
                    },
                })
                .to(scrollable, {
                    y: "-75",
                    delay: 2,
                })
                .to(scrollable, {
                    y: "0",
                    ease: "back.out(1)",
                    duration: 2,
                })

                return tl;
            }

            fadeInTl.current = getFadeInTimeline();
            scrollTl.current = getScrollTimeline();
            masterTl.current = gsap.timeline({ paused: true })
                .add(fadeInTl.current)
                .add(() => {
                    if (shouldPlayRef.current) {
                        scrollTl.current?.play(0);
                    }
                })
        },
        {scope, dependencies: [], revertOnUpdate: true}
    )
    return (
        <div
            ref={scope}
            className={cn(
                "spotify-mobile-wrapper spotify-wrapper relative w-26.25 h-50 rounded-lg bg-bg-secondary border-2 border-bg-tertiary px-1 py-2 flex flex-col items-start justify-start gap-2 overflow-hidden",
                hidden ? "hidden" : "flex"
        )}>
            <p className="scrollable releases-title text-[7px] text-start w-full h-auto text-text-primary lint-clamp-1">
                New Releases
            </p>
            <div className="scrollable releases-grid-wrapper w-max h-auto grid grid-cols-[38px_38px] auto-rows-max gap-1 shrink-0">
                {newReleases.map((release, index) => (
                    <AlbumItem
                        key={`${release.src}-${index}`}
                        src={srcPath + release.src}
                        title={release.title}
                        artist={release.artist}
                        className="release-card w-[38px] h-auto bg-bg-tertiary/50 rounded-md p-1"
                    />
                ))}
            </div>
        </div>
    )
}

const SpotifyDesktop = ({ shouldPlayThumbnail }: { shouldPlayThumbnail: boolean }) => {
    const scope = useRef<HTMLDivElement>(null);
    const masterTl = useRef<gsap.core.Timeline | null>(null);
    const fadeInTl = useRef<gsap.core.Timeline | null>(null);
    const albumScrollTl = useRef<gsap.core.Timeline | null>(null);
    // transition windows from album view to artist view
    const transitionTl = useRef<gsap.core.Timeline | null>(null);
    // scroll down to the album list and click the album to go back (looping between the two views)
    const artistScrollTl = useRef<gsap.core.Timeline | null>(null);
    // loop between views (albumScrollTl, transitionTl.play(), artistScrollTl, transitionTl.reverse())
    const loopTl = useRef<gsap.core.Timeline | null>(null);
    const shouldPlayRef = useRef(shouldPlayThumbnail);

    const trackList: Track[] = [
        { title: "NUEVAYoL", duration: "3:03" },
        { title: "VOY A LLeVARTE PA PR", duration: "2:36"},
        { title: "BAILE INoLVIDABLE", duration: "6:07"},
        { title: "PERFuMITO NEUVO", duration: "3:20"},
        { title: "WELTiTA", duration: "3:07"},
        { title: "VeLDÁ", duration: "3:55"},
        { title: "EL CLúB", duration: "3:42"},
        { title: "KETU TeCRÉ", duration: "4:10"}
    ]
    const topTracksList = [
        { title: "DtMF", duration: "3:57"},
        trackList[2],
        trackList[0]
    ]
    const discographyList = [
        { src: "dtmf.png", title: "DeBÍ TiRAR MáS FOToS", artist: "2025" },
        { src: "nadiesabie.png", title: "nadie sabe lo que va pasar mañana", artist: "2023" },
        { src: "unveranosinti.png", title: "Un Verano Sin Ti", artist: "2022" },
        { src: "el-ultimo-tour-del-mundo.png", title: "EL ÚLTIMO TOUR DEL MUNDO", artist: "2020" },

    ]

    useEffect(() => {
        shouldPlayRef.current = shouldPlayThumbnail;

        if (shouldPlayThumbnail) {
            loopTl.current?.paused(false);
            artistScrollTl.current?.paused(false);
            masterTl.current?.play();
        } else {
            masterTl.current?.pause(0);
            transitionTl.current?.pause(0);
        }
    }, [shouldPlayThumbnail])

    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            const sidebarItems = gsap.utils.toArray(".sidebar-item", root) as HTMLElement[];
            const albumViewWrapper = gsap.utils.toArray(".album-view-wrapper", root)[0] as HTMLElement;
            const albumCover = gsap.utils.toArray(".album-cover", root)[0] as HTMLElement;
            const subtitle = gsap.utils.toArray(".subtitle", root)[0] as HTMLElement;
            const title = gsap.utils.toArray(".title", root)[0] as HTMLElement;
            const artistWrapper = gsap.utils.toArray(".artist-wrapper", root)[0] as HTMLElement;
            const artistPfp = gsap.utils.toArray(".artist-pfp", root)[0] as HTMLElement;
            const artistName = gsap.utils.toArray(".artist-name", root)[0] as HTMLElement;
            const controlItems = gsap.utils.toArray(".control-item", root) as HTMLElement[];
            const tracklistItems = gsap.utils.toArray(".tracklist-item", root) as HTMLElement[];
            const scrollableV1 = gsap.utils.toArray(".scrollable-v1", root) as HTMLElement[];

            if (!sidebarItems || !albumViewWrapper || !albumCover || !subtitle || !title || !artistWrapper || !artistPfp || !artistName || !controlItems || !tracklistItems || !scrollableV1) return;

            const artistViewWrapper = gsap.utils.toArray(".artist-view-wrapper", root)[0] as HTMLElement;
            const scrollableV2 = gsap.utils.toArray(".scrollable-v2", root) as HTMLElement[];

            if (!artistViewWrapper || !scrollableV2) return;

            gsap.set(artistViewWrapper, { autoAlpha: 0, x: 200 });
            gsap.set(root, { autoAlpha: 0 });

            const getFadeInTimeline = () => {
                const tl = gsap.timeline({ defaults: { ease: "power1.out", duration: 0.6 } })
                .fromTo(root, {
                    autoAlpha: 0,
                    scale: 0.9
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }, 0.6)
                .fromTo(sidebarItems, {
                    autoAlpha: 0,
                    x: 20
                }, {
                    autoAlpha: 1,
                    x: 0,
                    stagger: {
                        each: 0.1,
                        from: "start"
                    }
                }, "<=0.3")
                .fromTo(albumCover, {
                    autoAlpha: 0,
                    scale: 0.8
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }, "-=0.3")
                .fromTo([subtitle, title, artistWrapper], {
                    autoAlpha: 0,
                    y: 20
                }, {
                    autoAlpha: 1,
                    y: 0,
                    stagger: {
                        each: 0.2,
                        from: "start"
                    },
                    duration: 0.8
                }, "-=0.2")
                .fromTo(controlItems, {
                    autoAlpha: 0,
                }, {
                    autoAlpha: 1,
                    stagger: {
                        each: 0.1,
                        from: "start"
                    }
                }, "-=0.6")
                .fromTo(tracklistItems, {
                    autoAlpha: 0,
                    x: -20
                }, {
                    autoAlpha: 1,
                    x: 0,
                    stagger: {
                        each: 0.1,
                        from: "start"
                    },
                    duration: 0.8
                }, "<")

                return tl;
            }

            const getAlbumScrollTimeline = () => {
                const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 2, delay: 1 }})
                .to(scrollableV1, {
                    y: -150,
                })
                .to(scrollableV1, {
                    y: 0,
                    delay: 2,
                })

                return tl;
            }

            const getTransitionTimeline = () => {
                const tl = gsap.timeline({ paused: true, defaults: { duration: 1.25 } })
                .to(albumViewWrapper, {
                    autoAlpha: 0,
                    x: -200,
                    ease: "power2.inOut"
                })
                .to(artistViewWrapper, {
                    autoAlpha: 1,
                    x: 0,
                    ease: "power2.inOut"
                }, "<")

                return tl;
            }

            const getArtistScrollTimeline = () => {
                const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 2 } })
                .to(scrollableV2, {
                    y: -100,
                    delay: 1,
                })
                // .to(scrollableV2, {
                //     y: 0,
                //     delay: 2,
                // })

                return tl;
            }
            
            
            fadeInTl.current = getFadeInTimeline();
            albumScrollTl.current = getAlbumScrollTimeline();
            transitionTl.current = getTransitionTimeline();
            artistScrollTl.current = getArtistScrollTimeline();

            loopTl.current = gsap.timeline()
                .add(albumScrollTl.current, ">")
                .add(() => transitionTl.current?.play(0), ">+=2")
                .add(artistScrollTl.current, `>+=${transitionTl.current?.duration() ?? 0}`)
                .add(() => {
                    transitionTl.current?.reverse();
                }, ">+=2")
                .add(() => { // resset artist view 
                    gsap.set(artistViewWrapper, { autoAlpha: 0, x: 200, y: 0 });
                }, `<+=${transitionTl.current?.duration() ?? 0}`)

            masterTl.current = gsap.timeline({
                paused: true,
                onComplete: () => {
                    if (shouldPlayRef.current) {
                        masterTl.current?.play("loopStart");
                    } else {
                        masterTl.current?.pause(0);
                    }
                }
            })
                .add(fadeInTl.current)
                .addLabel("loopStart")
                .add(loopTl.current, ">")

            return () => {
                masterTl.current?.kill();
                masterTl.current = null;
                fadeInTl.current?.kill();
                fadeInTl.current = null;
                albumScrollTl.current?.kill();
                albumScrollTl.current = null;
                transitionTl.current?.kill();
                transitionTl.current = null;
                artistScrollTl.current?.kill();
                artistScrollTl.current = null;
                loopTl.current?.kill();
                loopTl.current = null;
            }
        },
        {scope, dependencies: [], revertOnUpdate: true}

    )

    return (
        <div ref={scope} className="spotify-desktop-wrapper spotify-wrapper relative w-[320px] h-[180px] rounded-lg border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-start justify-start gap-1">
            <div className="sidebar relative h-full w-[75px] flex flex-col items-start justify-start gap-1">
                <div className="w-full h-[40px] bg-bg-secondary rounded-tl-md rounded-br-md flex flex-col items-center justify-start gap-1 px-2 py-1.5">
                    <div className="sidebar-item w-full flex items-center justify-start gap-1">
                        <Home size={8} className="text-neutral-900 dark:text-neutral-100" />
                        <p className="text-[7px] text-neutral-900 dark:text-neutral-100">
                            home
                        </p>
                    </div>
                    <div className="sidebar-item w-full flex items-center justify-start gap-1">
                        <Search size={8} className="text-text-secondary" />   
                        <p className="text-[7px]">
                            search
                        </p>
                    </div>
                </div>
                <div className="w-full h-full bg-bg-secondary">
                    <div className="sidebar-item w-full h-full">
                        <div className="w-full bg-bg-secondary rounded-tr-md flex justify-start items-center px-2 py-1.5 gap-1">
                            <ListMusic size={8} className="text-text-secondary" />
                            <p className="text-[7px]">
                                Your Library
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            
            <div className="main-content relative flex-1 h-full w-full bg-bg-secondary rounded-tr-md rounded-br-md px-2 py-1.5 overflow-hidden">
                {/* top navigation */}
                <div className="absolute top-0 left-0 w-full h-auto flex items-center justify-between z-20 px-2 py-1.5">
                    <div className="w-auto h-auto flex items-center justify-start gap-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-bg-primary flex-center">
                            <ChevronLeft size={8} className="text-neutral-900 dark:text-neutral-100" />
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-bg-primary flex-center">
                            <ChevronRight size={8} className="text-neutral-900 dark:text-neutral-100" />
                        </div>
                    </div>
                    <Logo width={10} height={10} className="scale-x-[-1]" />
                </div>
                {/* album view */}
                <div className="album-view-wrapper relative w-full h-full flex flex-col items-start justify-start gap-2 mt-2">
                    <div className="scrollable-v1 flex items-center justify-start gap-2 mt-2">
                        <Image
                            src={srcPath + "dtmf.png"}
                            alt="dtmf cover"
                            width={50}
                            height={50}
                            className="album-cover rounded-md"
                            draggable={false}
                        />
                        <div className="h-full w-auto flex flex-col items-start justify-start gap-1 mt-4">
                            <div className="subtitle-wrapper w-auto h-auto overflow-hidden">
                                <p className="subtitle text-[5px]">
                                    Album
                                </p>
                            </div>
                            <div className="title-wrapper w-auto h-auto overflow-hidden">
                                <h3 className="title text-[10px] font-bold line-clamp-1">
                                    DeBÍ TiRAR MáS FOToS
                                </h3>
                            </div>
                            <div className="w-auto h-auto overflow-hidden">
                                <div className="artist-wrapper flex items-center justify-start gap-1">
                                    <Image
                                        src={srcPath + "badbunny-pfp.png"}
                                        alt="badbunny profile picture"
                                        width={10}
                                        height={10}
                                        className="artist-pfp rounded-full"
                                        draggable={false}
                                    />
                                    <p className="artist-name text-[5px] text-text-primary">
                                        Bad Bunny
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="scrollable-v1 w-auto h-auto flex items-center justify-start gap-2 mt-2">
                        <div className="control-item w-4 h-4 rounded-full bg-indigo-500 flex-center">
                            <Play size={6} className="text-bg-primary fill-bg-primary" />
                        </div>
                        <Shuffle size={14} className="control-item text-text-secondary" />
                        <CirclePlus size={14} className="control-item text-text-secondary" />
                    </div>
                    <div className="scrollable-v1 tracklist-wrapper w-full h-full flex flex-col items-start justify-start gap-2 mt-2">
                        {trackList.map((album, index) => (
                            <TrackItem
                                key={`${album.title}-${index}`}
                                index={index}
                                track={album}
                                imageSrc={srcPath + "dtmf.png"}
                                imageAlt="dtmf cover"
                                className="tracklist-item"
                            />
                        ))}
                    </div>
                </div>
                {/* artist view */}
                <div className="artist-view-wrapper absolute inset-0 w-full h-full bg-neutral-100 dark:bg-neutral-900 rounded-tr-md rounded-br-md">
                    <div className="scrollable-v2 relative w-full h-18 banner-wrapper">
                            <Image
                                src={srcPath + "badbunny-banner.png"}
                                alt="bad bunny banner"
                                fill
                                className="object-cover rounded-tl-md rounded-tr-md"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-bg-secondary/50 rounded-tl-md rounded-tr-md pointer-events-none" />
                            <div className="absolute inset-0 z-10 flex flex-col items-start justify-start px-2 py-1 pointer-events-none pt-6 gap-1">
                                <Image
                                    src={srcPath + "badbunny-pfp.png"}
                                    alt="bad bunny profile picture"
                                    width={25}
                                    height={25}
                                    className="artist-pfp rounded-sm"
                                    draggable={false}
                                />
                                <div className="w-auto h-auto flex items-center justify-start gap-1">
                                    <p className="artist-name text-[7px] text-text-primary font-bold">
                                        Bad Bunny
                                    </p>
                                    <Verified size={10} className="text-emerald-500" />
                                </div>
                            </div>
                    </div>
                    <div className="scrollable-v2 artist-controls-wrapper w-auto h-auto flex items-center justify-start gap-2 mt-3 px-2">
                        <div className="artist-control-item w-7 h-3 rounded-full border border-indigo-500 flex-center">
                            <p className="text-[4px] text-text-primary">
                                Following
                            </p>
                        </div>
                        <Ellipsis size={14} className="artist-control-item text-text-tertiary" />
                    </div>
                    <div className="scrollable-v2 top-tracks-section w-full h-auto flex flex-col items-start justify-start gap-1 mt-3 px-2">
                        <p className="text-[7px] text-text-primary">
                            Top Tracks
                        </p>
                        {topTracksList.map((album, index) => (
                            <TrackItem
                                key={`${album.title}-${index}`}
                                index={index}
                                track={album}
                                imageSrc={srcPath + "dtmf.png"}
                                imageAlt="dtmf cover"
                                titleClassName="line-clamp-1"
                            />
                        ))}
                        <p className="text-[4px] text-text-secondary mt-0.5">
                            see more
                        </p>
                    </div>
                    <div className="scrollable-v2 discography-section w-full h-auto">
                        <p className="text-[7px] text-text-primary px-2 pt-2">
                            Discography
                        </p>
                        <div className="w-full h-auto flex items-start justify-start gap-2 px-2 py-1">
                            {discographyList.map((album, index) => (
                                <AlbumItem
                                    key={`${album.src}-${index}`}
                                    src={srcPath + album.src}
                                    title={album.title}
                                    artist={album.artist}
                                    className="w-10 h-auto bg-bg-tertiary/50 rounded-md p-1"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TrackItem = ({
    index,
    track,
    imageSrc,
    imageAlt,
    artist = "Bad Bunny",
    className,
    titleClassName,
}: {
    index: number;
    track: Track;
    imageSrc: string;
    imageAlt: string;
    artist?: string;
    className?: string;
    titleClassName?: string;
}) => {
    return (
        <div className={cn("w-full h-auto flex items-center justify-between", className)}>
            <div className="flex items-center justify-start gap-1">
                <span className="text-text-weprimary text-[6px]">{index + 1}.</span>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={15}
                    height={15}
                    className="rounded-xs"
                    draggable={false}
                />
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <p className={cn("text-[6px] text-text-primary", titleClassName)}>
                        {track.title}
                    </p>
                    <p className="text-[4px] text-text-secondary">
                        {artist}
                    </p>
                </div>
            </div>
            <p className="text-[4px] text-text-secondary">
                {track.duration}
            </p>
        </div>
    )
}

const AlbumItem = ({
    src,
    title,
    artist,
    className,
}: {
    src: string;
    title: string;
    artist: string;
    className?: string;
}) => {
    return (
        <div className={cn("h-auto flex flex-col items-start justify-start gap-1 shrink-0 overflow-hidden", className)}>
            <Image
                src={src}
                alt={`${title} cover`}
                width={30}
                height={30}
                className="rounded-sm shrink-0 max-w-none"
                draggable={false}
            />
            <div className="w-full min-w-0 h-auto flex flex-col items-start justify-start gap-0 shrink-0">
                <p className="w-full min-w-0 text-[5px] text-text-primary line-clamp-1">
                    {title}
                </p>
                <p className="w-full min-w-0 text-[4px] text-text-secondary line-clamp-1">
                    {artist}
                </p>
            </div>
        </div>
    )
}

export default SpotifyThumbnail