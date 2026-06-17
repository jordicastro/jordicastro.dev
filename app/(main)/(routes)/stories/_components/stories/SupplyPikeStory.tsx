"use client"

import { Nunito } from "next/font/google";
import { cn } from "@/lib/utils";
import ReactionPill from "@/app/(main)/_components/ReactionPill";
import {
  Squiggle1Blue, SPLogo, Squiggle2Blue, TriangleBlue, CircleBlue,
  SquiggleYellow, TriangleYellow, SquiggleGreen, RectangleGreen,
  CrossRed, TrapezoidRed,
  TimelineNodes,
  PowerpointIcon
} from "@/components/svgs/svgs";
import ToC from "@/components/ToC";
import { spSections } from "@/constants/constants";
import { useMediaQuery } from "usehooks-ts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin, Observer } from 'gsap/all';
import { useRef } from "react";
import AtAGlance from "@/app/(main)/_components/AtAGlance";
import { GlanceData, StoryTheme } from "@/types/types";
import StoryText from "@/app/(main)/_components/StoryText";

const spFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sp",
  display: "swap",
})

const SPStoryTheme: StoryTheme = {
    font: spFont.style.fontFamily,
    textPrimary: "--sp-blue",
  }

gsap.registerPlugin(useGSAP, DrawSVGPlugin, Observer);

const SupplyPikeStory = () => {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      // title els
      const shapePaths = gsap.utils.selector(root)("#sp-shape") as unknown as SVGPathElement[];
      const title = gsap.utils.selector(root)(".title") as unknown as HTMLElement;
      const subtitle = gsap.utils.selector(root)(".subtitle") as unknown as HTMLElement;
      const spTitleParent = gsap.utils.selector(root)(".sp-title-parent")[0] as HTMLElement | undefined;

      // first sections els
      const reactionPill = gsap.utils.selector(root)(".reaction-pill")[0] as HTMLElement | undefined;
      const glanceTitle = gsap.utils.selector(root)(".glance-title")[0] as HTMLElement | undefined;
      const glanceItems = gsap.utils.selector(root)(".glance-item") as unknown as HTMLElement[];
      const glanceItemDividers = gsap.utils.selector(root)(".glance-item-divider") as unknown as HTMLElement[];
      const abstractSection = gsap.utils.selector(root)(".abstract-section")[0] as HTMLElement | undefined;
      if (!abstractSection) return;
      const abstractTitle = gsap.utils.selector(abstractSection)?.(".abstract-title")[0] as unknown as HTMLElement | undefined;
      const abstractParagraphs = gsap.utils.selector(abstractSection)?.(".paragraph") as unknown as HTMLElement[] | undefined;

      if (!shapePaths || !title || !subtitle || !spTitleParent || !reactionPill || !glanceTitle || !glanceItems || !glanceItemDividers || !abstractTitle || !abstractParagraphs) return;

      console.log('abstractSection', abstractSection)
      console.log('abstractTitle', abstractTitle)
      console.log('abstractParagraphs', abstractParagraphs)

      // title setup
      gsap.set(shapePaths, { drawSVG: "0%" });
      gsap.set(shapePaths, { opacity: 0.5 });
      gsap.set(title, { autoAlpha: 0, y: 90 });
      gsap.set(subtitle, { autoAlpha: 0, y: 40 });
      // sections setup
      gsap.set(reactionPill, { autoAlpha: 0, scale: 1 });
      gsap.set(glanceTitle, { autoAlpha: 0, y: 40 });
      gsap.set(glanceItems, { autoAlpha: 0, y: 40 });
      gsap.set(glanceItemDividers, { autoAlpha: 0, scaleX: 0, y:20, transformOrigin: "left center" });
      gsap.set(abstractTitle, { autoAlpha: 0, y: 40 });
      gsap.set(abstractParagraphs, { autoAlpha: 0, y: 30 });

      const opacitySetters = shapePaths.map((shape) =>
        gsap.quickTo(shape, "opacity", { duration: 0.2, ease: "power2.out" })
      );

      const onPointerMove = (e: PointerEvent) => {
        const bounds = spTitleParent.getBoundingClientRect();
        const pointerX = e.clientX - bounds.left;
        const pointerY = e.clientY - bounds.top;

        let closestIndex = -1;
        let minDistance = Number.POSITIVE_INFINITY;

        shapePaths.forEach((shape, index) => {
          const shapeBounds = shape.getBoundingClientRect();
          if (shapeBounds.width === 0 && shapeBounds.height === 0) return;

          const shapeX = shapeBounds.left + shapeBounds.width / 2 - bounds.left;
          const shapeY = shapeBounds.top + shapeBounds.height / 2 - bounds.top;
          const distance = Math.hypot(pointerX - shapeX, pointerY - shapeY);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex === -1) return;

        opacitySetters.forEach((setOpacity, index) => {
          setOpacity(index === closestIndex ? 1 : 0.5);
        });
      }

      const onPointerLeave = () => {
        opacitySetters.forEach((setOpacity) => setOpacity(0.5));
      }

      const titleTl = gsap.timeline({
        defaults: { duration: 1.5, ease: "power2.inOut" },
        onComplete: () => {
          spTitleParent.addEventListener("pointermove", onPointerMove);
          spTitleParent.addEventListener("pointerleave", onPointerLeave);
        }
      })

      .to(shapePaths, {
        drawSVG: "100%",
        stagger: {
          each: 0.2,
          from: "random",
        }
      })
      .to(title, {
        autoAlpha: 1,
        y: 0,
      }, "<=0.3")
      .to(subtitle, {
        autoAlpha: 1,
        y: 0,
      }, "<=0.5")

      const fadeInSections = gsap.timeline({ defaults: { duration: 1, ease: "power2.inOut" }})
      .to(reactionPill, {
        autoAlpha: 1,
        duration: 0.5
      })
      .to(reactionPill, {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2")
      .to(reactionPill, {
        scale: 1,
        duration: 0.5,
        ease: "power1.inOut"
      }, ">=0.5")
      .to(glanceTitle, {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out"
      }, "-=1.5")
      .to(glanceItems, {
        autoAlpha: 1,
        y: 0,
        stagger: {
          each: 0.08,
          from: "start"
        }
      }, "<=0.4")
      .to(glanceItemDividers, {
        autoAlpha: 1,
        scaleX: 1,
        y: 0,
        stagger: {
          each: 0.08,
          from: "start"
        }
      }, "<=0.1")
      .to(abstractTitle, {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.8
      }, "-=0.5")
      .to(abstractParagraphs, {
        autoAlpha: 1,
        y: 0,
        stagger: {
          each: 0.1,
          from: "start"
        },
        ease: "power2.out",
        duration: 1
      }, "<=0.4")

      // at a glance fade in and up
      // glance items stagger in fade in from start and up or left to right

      const masterTl = gsap.timeline()
      .add(titleTl)
      .add(fadeInSections, "-=2")

      return () => {
        masterTl.kill();
        titleTl.kill();
        spTitleParent.removeEventListener("pointermove", onPointerMove);
        spTitleParent.removeEventListener("pointerleave", onPointerLeave);
      }

    },
    { scope, dependencies: [] }
  )

  const glanceData: GlanceData = {
    theme: SPStoryTheme,
    primaryColor: "var(--sp-blue)",
    items: [
      {
        title: "Tech Stack",
        description: "Typescript, Vite, MongoDB, PostgreSQL",
        descriptionCN: "text-(--sp-blue)"
      },
      {
        title: "Tools",
        description: "Docker, Git, Kubernetes",
        descriptionCN: "text-(--sp-red)"
      },
      {
        title: "Timeline (2025)",
        description: (
          <div className="relative w-full flex flex-col gap-2 text-(--sp-green) items-center">
            <div>
              <div className="flex items-center gap-8 text-inherit font-semibold">
                <p className="text-inherit">May</p>
                <p className="text-inherit">Aug</p>
              </div>
            </div>
            <TimelineNodes className="absolute" />
          </div>
        )
      },
      {
        title: "Standout Metrics",
        description: (
          <div className="w-full flex flex-col items-start gap-2 text-(--sp-yellow) text-md font-semibold" style={{ fontFamily: spFont.style.fontFamily }}>
            <span>31 PRs</span>
            <span>104 meetings</span>
          </div>
        )
      },
      {
        title: "Important Links",
        description: (
          <div className="w-full h-auto flex items-start gap-4">
            <div
              className="w-auto h-auto hover:cursor-pointer"
              role="button"
              onClick={() => {
                window.open("/documents/SP_SE_Intern_Jordi_Castro_Presentation.pptx", "_blank");
              }}
              data-cursor='pointer'
            >
              <PowerpointIcon className="w-7 h-7"/>
            </div>
          </div>
        )
      }
    ]
}

  return (
    <>
      <ToC sections={spSections} />
      <div ref={scope} className="min-h-screen w-full">
        <div className="mx-auto w-full max-w-500 px-0">
          <SPTitle>
            <SPShapes />
          </SPTitle>
          <div className="story-main-content w-full px-4 sm:px-10 lg:px-20 flex flex-col items-start gap-10 3xl:gap-20 mt-subsection">
            <ReactionPill className="w-fit" storyId={'supplypike'} />
            <AtAGlance glanceData={glanceData} />
            <AbstractSection />
          </div>
        </div>
      </div>
    </>
  )
}

const SPTitle = ({ children }: { children?: React.ReactNode }) => {
  
  return (
    <div className="sp-title-parent relative mx-auto w-full h-125 flex-center">
      <div className="sp-title-wrapper relative w-auto h-auto flex flex-col gap-6">
        <div className="title-wrapper flex items-center gap-6 overflow-hidden">
          <SPLogo className="title w-18 h-18 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24"/>
          <h2 className={cn(
            "title text-(--sp-blue) 2xl:text-8xl! md:text-7xl/tight! sm:text-6xl/tight! text-5xl/tight!",
            spFont.className
          )}>
            supplypike
          </h2>
        </div>
        <div className="subtitle-wrapper w-auto h-auto overflow-hidden">
          <p className={cn("subtitle text-sm sm:text-md md:text-lg 2xl:text-xl font-bold text-center", spFont.className)}>
            features I implemented as a{" "}
            <span className="text-(--sp-blue)">
              software engineer intern
            </span>
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}

const SPShapes = () => {
  const md = useMediaQuery("(min-width: 768px)", { initializeWithValue: false });

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* pseudo title layer to position some shapes relative to it */}
      <div className="relative abs-center w-102 h-32.5 md:w-117 md:h-36 2xl:w-151 2xl:h-37.5">
        <TriangleBlue className="absolute right-25 -bottom-18 sm:abs-x-center sm:-bottom-30" stroke={md ? "var(--sp-blue)" : "var(--sp-red)"}/>
        <CircleBlue className="absolute -top-30 right-30 sm:top-4 sm:-right-30 md:-right-40" stroke={md ? "var(--sp-blue)" : "var(--sp-red)"}/>
        <SquiggleYellow className="absolute abs-x-center -top-20 left-40 sm:hidden xl:block xl:-top-10 xl:-left-40 2xl:-left-70" />
        <TrapezoidRed className="hidden xl:block absolute -bottom-40 -right-40" />
        {/* extra large screens extras */}
        <CircleBlue stroke={"var(--sp-red)"} className="hidden 2xl:block absolute -bottom-20 -left-40" />
        <TriangleBlue stroke={"var(--sp-green"} className="hidden 2xl:block rotate-100 absolute left-50 -top-25" />
        <SquiggleYellow stroke={"var(--sp-green)"} className="hidden 2xl:block rotate-110 absolute -right-100 top-10" />
      </div>
      <Squiggle1Blue className="absolute left-0 top-0 md:w-auto md:h-auto w-40 h-40"/>
      <Squiggle2Blue className="absolute right-0 bottom-0 md:w-auto md:h-auto w-50 h-50"/>
      <TriangleYellow className="hidden sm:block absolute top-0 right-60" />
      <SquiggleGreen className="absolute left-5 sm:left-20 lg1:left-70 bottom-20" />
      <RectangleGreen className="absolute right-0 top-10 lg1:top-20" />
      <CrossRed className="hidden md:block absolute top-0 left-1/3" />

    </div>
  )
}

const AbstractSection = () => {

  return (
    <div className="abstract-section w-full h-auto">
      <StoryText
        className=""
        title="abstract"
        cols={1}
        storyTheme={SPStoryTheme}
      >
        <Paragraph>
          The SupplyPike
          {" "}
          (
          <span className="underline underline-offset-4 font-bold hover:decoration-(--sp-blue) hover:cursor-pointer" role="button" onClick={() => window.open("https://www.spscommerce.com/", "_blank")}>
            SPS Commerece
          </span>
          )
          {" "}
          Software Engineer Internship is a twelve week Summer program. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        </Paragraph>
        <Paragraph className="mt-5">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Paragraph>
        <Paragraph className="mt-5">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. 
        </Paragraph>
      </StoryText>
    </div>
  )
}

const Paragraph = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <p className={cn("paragraph text-inherit text-md font-semibold", "text-(" + SPStoryTheme.pText + ")", className)} style={{ fontFamily: SPStoryTheme.font }}>
      {children}
    </p>
  )
}

export default SupplyPikeStory