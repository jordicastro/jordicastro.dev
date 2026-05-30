import Image from 'next/image'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

interface PhotoCardProps {
    src: string
    liveSrc?: string
    alt: string
    width: number
    height: number
    className?: string
}

const WIDTH_CLASS_REGEX = /(^|\s)w-(?:auto|fit|full|\d|\[|\()/

const PhotoCard = ({ src, liveSrc, alt, width, height, className }: PhotoCardProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const hasExplicitWidth = WIDTH_CLASS_REGEX.test(className ?? '');
    gsap.registerPlugin(useGSAP);

    const { contextSafe } = useGSAP(() => {
        if (!liveSrc) return;
        const livePhoto = gsap.utils.selector(scopeRef.current)('.live-photo')[0] as HTMLVideoElement | undefined;
        const staticPhoto = gsap.utils.selector(scopeRef.current)('.static-photo')[0] as HTMLImageElement | undefined;
        if (!livePhoto || !staticPhoto) return;
        gsap.set(livePhoto, { autoAlpha: 0 });
        const tl = gsap.timeline({ paused: true, ease: "power1.inOut" });

        tl.to(livePhoto, { autoAlpha: 1, duration: 0.5 })
            .to(staticPhoto, { autoAlpha: 0, duration: 0.5 }, 0)
            .add(() => {
                livePhoto.currentTime = 0
                void livePhoto.play()
            }, 0)

        tlRef.current = tl;
    }, {})

    const playLivePhoto = contextSafe(() => {
        if (!liveSrc) return;
        tlRef.current?.restart();
    });

    const resetStaticPhoto = contextSafe(() => {
        if (!liveSrc) return;
        const livePhoto = gsap.utils.selector(scopeRef.current)('.live-photo')[0] as HTMLVideoElement | undefined;
        const staticPhoto = gsap.utils.selector(scopeRef.current)('.static-photo')[0] as HTMLImageElement | undefined;
        if (!livePhoto || !staticPhoto) return;
        gsap.set(staticPhoto, { autoAlpha: 1 });
        gsap.set(livePhoto, { autoAlpha: 0 });
        tlRef.current?.pause(0);
    });

    return (
        <div
            className={cn('photo-card-wrapper relative', className)}
            ref={scopeRef}
            style={{ width: hasExplicitWidth ? undefined : `${width}px` }}
            onContextMenu={(event) => event.preventDefault()}
            onMouseEnter={playLivePhoto}
            onMouseLeave={resetStaticPhoto}
            onTouchStart={playLivePhoto}
            onTouchEnd={resetStaticPhoto}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className='static-photo block h-auto w-full object-cover rounded-lg select-none'
                draggable={false}
            />
            {liveSrc && (
                <video
                    src={liveSrc}
                    loop
                    muted
                    playsInline
                    className='live-photo absolute top-0 left-0 h-full w-full object-cover rounded-lg select-none'
                />
            )}
        </div>
    )
}

export default PhotoCard