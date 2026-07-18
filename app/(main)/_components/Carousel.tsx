"use client"

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MorphSVGPlugin, Observer } from "gsap/all";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

gsap.registerPlugin(useGSAP, MorphSVGPlugin, Observer);

interface CarouselProps {
    slides: React.ReactNode[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    pagination?: boolean;
    activePaginationColor?: string;
    className?: string;
}

const Carousel = ({ slides, autoPlay, autoPlayInterval, pagination, activePaginationColor="#0066FF", className }: CarouselProps) => {
  const scope = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animateSlidesRef = useRef<((direction: "left" | "right") => void) | null>(null);
  const isAnimatingRef = useRef(false);
  const numPaginationDots = Math.min(slides.length, 5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [areTouchControlsVisible, setAreTouchControlsVisible] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(autoPlay ?? false);
  const isMobile = useMediaQuery("(max-width: 463px)", { initializeWithValue: false });
  const { resolvedTheme } = useTheme();
  const paginationInactiveColor = resolvedTheme === "dark" ? "#262626": "#e5e5e5";
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const playPauseMorphTl = useRef<gsap.core.Timeline | null>(null);

  const getSlideElements = () => Array.from(scope.current?.querySelectorAll<HTMLElement>(".carousel-slide") ?? []);
  const getPaginationDotElements = () => Array.from(scope.current?.querySelectorAll<HTMLElement>(".pagination-dot") ?? []);

  const wrapIndex = (index: number) => {
    if (!slides.length) return 0;

    return (index + slides.length) % slides.length;
  };

  const syncSlidePositions = (activeIndex: number) => {
    const slideElements = getSlideElements();

    if (!slideElements.length) return;

    const previousIndex = wrapIndex(activeIndex - 1);
    const nextIndex = wrapIndex(activeIndex + 1);

    slideElements.forEach((slideElement, index) => {
      const isActive = index === activeIndex;
      const isPrevious = slideElements.length > 1 && index === previousIndex && previousIndex !== activeIndex;
      const isNext = slideElements.length > 1 && index === nextIndex && nextIndex !== activeIndex && nextIndex !== previousIndex;

      let xPercent = 100;

      if (isActive) {
        xPercent = 0;
      } else if (isPrevious) {
        xPercent = -100;
      }

      gsap.set(slideElement, {
        xPercent,
        autoAlpha: isActive || isPrevious || isNext ? 1 : 0,
        zIndex: isActive ? 2 : 1,
      });
    });
  };

  const syncPaginationDots = (activeIndex: number) => {
    const paginationDots = getPaginationDotElements();

    if (!paginationDots.length) return;

    paginationDots.forEach((dotElement, index) => {
      gsap.set(dotElement, {
        backgroundColor: index === activeIndex ? activePaginationColor : paginationInactiveColor,
      });
    });
  };

  const clearAutoPlayTimer = () => {
    if (!autoPlayTimerRef.current) return;

    clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = null;
  };

  const clearTouchControlsTimer = () => {
    if (!touchControlsTimerRef.current) return;

    clearTimeout(touchControlsTimerRef.current);
    touchControlsTimerRef.current = null;
  };

  const resetAutoPlayTimer = () => {
    clearAutoPlayTimer();

    if (!shouldAutoPlay || slides.length <= 1) return;

    autoPlayTimerRef.current = setInterval(() => {
      if (isAnimatingRef.current) return;
      animateSlidesRef.current?.("right");
    }, autoPlayInterval ?? 5000);
  };

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useGSAP(
    () => {
      const pausePath = playButtonRef.current?.querySelector<SVGPathElement>(".pause-path");
      const playPath = playButtonRef.current?.querySelector<SVGPathElement>(".play-path");
      if (!pausePath || !playPath) return;

      playPauseMorphTl.current?.kill();

      gsap.set(pausePath, { display: "block" });
      gsap.set(playPath, { display: "none" });

      playPauseMorphTl.current = gsap.timeline({ paused: true, defaults: { duration: 0.5, ease: "expo.inOut", overwrite: "auto" } })
        .to(pausePath, {
          morphSVG: {
            shape: playPath,
            type: "rotational",
          }
        });

      playPauseMorphTl.current.progress(shouldAutoPlay ? 0 : 1).pause();
    },
    { scope: playButtonRef, dependencies: []}
  )

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      syncPaginationDots(0);
    },
    { dependencies: [] }
  )

  const { contextSafe } = useGSAP(
    () => {
      const root = scope.current;
      const vTolerance = isMobile ? 1800: 5000;
      if (!root) return;

      syncSlidePositions(currentSlideIndex);

      // the swipe observer for mobile
      const swipeObserver = Observer.create({
        target: root,
        type: "pointer,touch",
        tolerance: 24,
        dragMinimum: 8,
        ignore: '.ignore-swipe',
        onRight: (self) => {
          const v = Math.abs(self.velocityX)
          if (v > vTolerance) {
            animateSlidesRef.current?.("left")
          }
        },
        onLeft: (self) => {
          const v = Math.abs(self.velocityX)
          if (v > vTolerance) {
            animateSlidesRef.current?.("right")
          }
        }
      });
      
    return () => {
      swipeObserver.kill();
    }
    },
    { scope, dependencies: [currentSlideIndex, slides.length]}
  )

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      syncPaginationDots(currentSlideIndex);
    },
    { scope, dependencies: [currentSlideIndex, resolvedTheme, activePaginationColor] }
  )

  const animateSlides = contextSafe((direction: "left" | "right") => {
    const root = scope.current;
    if (!root || isAnimating || slides.length <= 1) return;

    const slideEls= getSlideElements();
    const paginationDots = getPaginationDotElements();
    if (!slideEls.length) return;

    const targetIndex = direction === "left"
      ? wrapIndex(currentSlideIndex - 1)
      : wrapIndex(currentSlideIndex + 1);
    const currentSlide = slideEls[currentSlideIndex];
    const currentDot = paginationDots[currentSlideIndex];
    const targetSlide = slideEls[targetIndex];
    const targetDot = paginationDots[targetIndex];


    if (!currentSlide || !targetSlide) return;

    const incomingXPercent = direction === "left" ? -100 : 100;
    const outgoingXPercent = direction === "left" ? 100 : -100;

    gsap.set(targetSlide, { autoAlpha: 1, xPercent: incomingXPercent, zIndex: 3 });
    gsap.set(currentSlide, { autoAlpha: 1, xPercent: 0, zIndex: 2 });

    gsap.timeline({
      defaults: { duration: 0.75, ease: "power3.inOut" },
      onStart: () => setIsAnimating(true),
      onComplete: () => {
        syncSlidePositions(targetIndex);
        syncPaginationDots(targetIndex);
        setCurrentSlideIndex(targetIndex);
        setIsAnimating(false);
      }
    })
      .to(currentSlide, { xPercent: outgoingXPercent }, 0)
      .to(targetSlide, { xPercent: 0 }, 0)
      .to(currentDot, { backgroundColor: paginationInactiveColor, duration: 0.25, ease: "power1.inOut" }, 0)
      .to(targetDot, { backgroundColor: activePaginationColor, duration: 0.25, ease: "power1.inOut" }, 0)

  });

  animateSlidesRef.current = animateSlides;

  useEffect(() => {
    resetAutoPlayTimer();

    return () => clearAutoPlayTimer();
  }, [shouldAutoPlay, autoPlayInterval, slides.length]);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (!isTouchDevice) return;

    const showTouchControls = (event: TouchEvent) => {
      const target = event.target;
      const tappedControl = target instanceof Element && target.closest('[data-carousel-control="true"]');

      clearTouchControlsTimer();

      if (tappedControl) {
        setAreTouchControlsVisible(true);
        touchControlsTimerRef.current = setTimeout(() => {
          setAreTouchControlsVisible(false);
          touchControlsTimerRef.current = null;
        }, 3000);
        return;
      }

      let shouldShowControls = true;

      setAreTouchControlsVisible((prev) => {
        shouldShowControls = !prev;
        return shouldShowControls;
      });

      if (!shouldShowControls) return;

      touchControlsTimerRef.current = setTimeout(() => {
        setAreTouchControlsVisible(false);
        touchControlsTimerRef.current = null;
      }, 4000);
    };

    root.addEventListener("touchstart", showTouchControls, { passive: true });

    return () => {
      root.removeEventListener("touchstart", showTouchControls);
      clearTouchControlsTimer();
    };
  }, []);

  const moveLeft = () => {
    resetAutoPlayTimer();
    animateSlides("left");
  };

  const moveRight = () => {
    resetAutoPlayTimer();
    animateSlides("right");
  };

  const handlePauseClick = () => {
    if (!playPauseMorphTl.current || playPauseMorphTl.current.isActive()) return;

    if (shouldAutoPlay) {
      playPauseMorphTl.current?.play();
    } else {
      playPauseMorphTl.current?.reverse();
    }

    setShouldAutoPlay(!shouldAutoPlay);

  }

  const controlsVisibilityClassName = areTouchControlsVisible ? "opacity-100" : "opacity-0 group-hover/carousel:opacity-100";

  return (
    <div ref={scope} className={cn("carousel group/carousel relative w-full h-auto flex-center flex-col gap-8", className)}>
      <div className="relative carousel-slides w-full h-auto flex-center">
        <div className="slides-mask relative grid w-19/20 h-auto overflow-hidden">
          {slides.map((slide, index) => (
            <div key={index} className="relative col-start-1 row-start-1 carousel-slide w-full h-auto flex-center">
              {slide}
            </div>
          ))}
          {/* carousel controls */}
          <div
            className={cn("back-button ignore-swipe abs-y-center left-4 z-10 w-10 h-7 rounded-full bg-bg-tertiary/75 flex-center cursor-pointer transition-opacity duration-250 ease-in-out", controlsVisibilityClassName)}
            role="button"
            data-carousel-control="true"
            data-cursor="pointer"
            onClick={moveLeft}
          >
            <ChevronLeft className="w-5 h-5 stroke-3 text-text-secondary" />
          </div>
          <div
            className={cn("forward-button ignore-swipe abs-y-center right-4 z-10 w-10 h-7 rounded-full bg-bg-tertiary/75 flex-center cursor-pointer transition-opacity duration-250 ease-in-out", controlsVisibilityClassName)}
            role="button"
            data-carousel-control="true"
            data-cursor="pointer"
            onClick={moveRight}
          >
            <ChevronRight className="w-5 h-5 stroke-3 text-text-secondary" />
          </div>
        </div>
        <div className="pause-button ignore-swipe pointer-events-none absolute top-1 left-1/2 z-30 h-50 w-full max-w-130 -translate-x-1/2">
          <button
            type="button"
            ref={playButtonRef}
            className={cn("pointer-events-auto absolute top-0 right-4 w-10 h-7 rounded-full bg-bg-tertiary/75 flex-center cursor-pointer transition-opacity duration-250 ease-in-out", controlsVisibilityClassName)}
            data-carousel-control="true"
            data-cursor="pointer"
            onClick={handlePauseClick}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-text-secondary">
                    <path
                        className="play-path"
              d="M8.5 6.5v11l8.5-5.5z"
                        style={{ display: "none" }}
                    />
                    <path
                        className="pause-path"
                  d="M7 5h3v14H7z M14 5h3v14h-3z"
                    />
            </svg>
          </button>
        </div>
      </div>
      {pagination && (
        <div className="carousel-pagination w-full h-auto flex-center gap-3">
          {Array.from({ length: numPaginationDots }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "pagination-dot w-3 h-3 rounded-full bg-bg-tertiary/50 transition-all duration-250 ease-in-out",
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel