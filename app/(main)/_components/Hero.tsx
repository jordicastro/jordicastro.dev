import PhotoCard from '@/components/PhotoCard'
import { useMediaQuery } from 'usehooks-ts';

const Hero = () => {
    const gridItemIds = ["title", "cards-right", "cards-left", "about"]
    const isMobile = useMediaQuery("(max-width: 992px)"); // usually 768, but need to start mobile breakpoint earlier

    return (
        <>
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
                                <h1 className="flex text-center max-w-3/4">
                                    Jordi Castro
                                </h1>
                                <p className="flex items-center gap-3 text-center">
                                    <span className="text-2xl">️
                                        🌞
                                    </span>
                                    /ˈdʒɔr.di ˈkæs.troʊ/
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
        </>
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
            <h4 className="introducing-el absolute top-0 left-15">
                introducing...
            </h4>
            <div className="abs-center flex flex-col gap-5">
                <h1 className="title-el">
                    Jordi Castro
                </h1>
                <p className="subtitle-el flex items-center gap-3">
                    <span className="emojis text-2xl tracking-wider">️
                        🌞🌋🥭
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
            <div className="flex h-full w-full items-end gap-card overflow-x-hidden">
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
        <div className="hero-grid-item about-wrapper flex-start">
            <div className="flex flex-col items-start justify-start h-full w-full xl:w-5/8 mt-section">
                <h4>about</h4>
                <div className="flex flex-col gap-ptag">
                    {aboutPTags.map((p, i) => (
                        <p key={i}>
                            {p}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Hero