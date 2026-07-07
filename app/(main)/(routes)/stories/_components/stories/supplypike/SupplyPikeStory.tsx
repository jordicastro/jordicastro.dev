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
import { useRef, useState } from "react";
import AtAGlance from "@/app/(main)/_components/AtAGlance";
import { GlanceData, StoryTheme, TabSection } from "@/types/types";
import StoryText from "@/app/(main)/_components/StoryText";
import SectionTabs from "@/app/(main)/_components/SectionTabs";
import OtpCountdown from "./sections/OtpCountdown";
import AdminSearch from "./sections/AdminSearch";
import KeyOrgRolesSection from "./sections/KeyOrgRoles";
import StoryFigure from "../../StoryFigure";
import Callout from "../../Callout";
import CodeText from "@/components/CodeText";

const spFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sp",
  display: "swap",
})

export const SPStoryTheme: StoryTheme = {
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
          <div className="story-main-content w-full px-4 sm:px-10 lg:px-20 flex flex-col items-start gap-14 3xl:gap-20 mt-subsection">
            <ReactionPill className="w-fit ml-0 sm:ml-0" storyId={'supplypike'} />
            <AtAGlance glanceData={glanceData} />
            <AbstractSection />
            <FavoriteFeaturesSection />
            <GrowthSection />
            <ConclusionSection />
            <BottomSection />
          </div>
        </div>
      </div>
    </>
  )
}

const SPTitle = ({ children }: { children?: React.ReactNode }) => {
  
  return (
    <div id="overview" className="sp-title-parent relative mx-auto w-full h-125 flex-center">
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
    <div id="abstract" className="abstract-section w-full h-auto">
      <StoryText
        className=""
        title="abstract"
        cols={1}
        storyTheme={SPStoryTheme}
      >
        <Paragraph>
          SupplyPike is a SaaS (Software as a Service) revenue recovery company that facilitates the dispute claims process for suppliers, recovering thousands in false claims. SupplyPike was acquired by
          {" "}
          (
          <span className="underline underline-offset-4 font-bold hover:decoration-(--sp-blue) hover:cursor-pointer" role="button" data-cursor="pointer" onClick={() => window.open("https://www.spscommerce.com/", "_blank")}>
            SPS Commerece
          </span>
          )
          {" "}
          in 2024. The software engineer internship is a twelve week summer program. During the twelve weeks, I was onboarded, trained, and quickly put on my first tasks. These tasks, or stories, were improvements to the admin facing pages. With an emphasis on attention to detail, readability, and efficiency, I was able to complete 31 high quality pull requests that facilitated admin’s use of the SupplyPike application.
        </Paragraph>
        <Paragraph className="mt-4">
          At SupplyPike, interns are treated no differently than full-time employees. I was a member of the Core Team, which has the oldest codebase, including core endpoint, UI, and authentication, all integral for the function of the other teams’ repositories. During the internship, I actively participated in many meetings. On the Core Team, I met with the team daily for stand up, where we shared our progress on our current projects. I met weekly with the software developers on my team to brainstorm solutions to stubborn bugs we had encountered through the week. I had biweekly 1:1’s with my manager, where I received feedback on story throughput. I was also involved in company wide developer, general, and intern meetings. All of these meetings gave me professional experience and the soft skills required in a modern job.
        </Paragraph>
        <Paragraph className="mt-4">
          Most stories I completed followed the following procedure. I would start by identifying the problem, looking through the code space (frontend and backend) to see what was wrong or missing and brainstorm next steps. Next, I would expose an endpoint to get the data necessary to implement the feature. Once I finished the first pass, I would open a pull request (PR) and ask for feedback by my team and Copilot. The Core team used a CI/CD (Continuous integration continuous deployment) workflow, so as soon as I finished my revisions, the PR would go directly into production.
        </Paragraph>
        <Paragraph className="mt-4">
          The purpose of this story is to provide a quick overview of the SupplyPike internship, specifically highlighting features that I implemented from start to finish, the technologies and tools I used to develop, and the technical and professional skills I developed along the way.
        </Paragraph>
      </StoryText>
    </div>
  )
}

const FavoriteFeaturesSection = () => {
  return (
    <div id="features" className="favorite-features-section w-full h-full">
      <StoryText
        className="h-auto"
        title="favorite features"
        cols={2}
        columnFill="balance"
        storyTheme={SPStoryTheme}
      >
        <div className="w-full min-h-0 flex flex-col items-start">
          <TabSections />
        </div>
      </StoryText>

    </div>
  )
}

const TabSections = () => {
  const sections: TabSection[] = [
    { title: "Otp Countdown", id: "otp-countdown", content: OtpCountdown },
    { title: "Admin Search", id: "admin-search", content: AdminSearch },
    { title: "Key Org Roles", id: "key-org-roles", content: KeyOrgRolesSection },
  ]
  const scope = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const ActiveSectionContent = sections.find(section => section.id === activeSection)?.content;

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const sectionContent = gsap.utils.selector(root)(".section-content") as unknown as HTMLElement;
      if (!sectionContent) return;

      gsap.fromTo(sectionContent, {
        autoAlpha: 0,
      }, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.inOut"
      })
    },
    { scope, dependencies: [activeSection] }
  )

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  }

  return (
    <div ref={scope} className="w-full h-auto flex flex-col items-start gap-4">
      <Paragraph className="indent-0">
        Here are some of my favorite features that I implemented as an intern at SupplyPike.
      </Paragraph>
      <SectionTabs sections={sections} storyTheme={SPStoryTheme} onSectionChange={handleSectionChange} />
      {ActiveSectionContent && <ActiveSectionContent />}
    </div>
  )
}

const GrowthSection = () => {

  return (
    <div id="growth" className="growth-section w-full h-full">
      <StoryText
        className="h-auto"
        title="Growth (What I Learned)"
        cols={1}
        storyTheme={SPStoryTheme}
      >
        <div className="w-full min-h-0 flex flex-col items-start gap-4">
          <Paragraph title="Docker">
            Docker was an essential part of the development environment, allowing each service in the application to run locally inside its own isolated container. Since the core architecture consisted of multiple repositories working together, Docker provided a stable environment where all services could communicate.
          </Paragraph>
          <Paragraph>
            Throughout the internship, when I ran into a UI or API bug, I quickly learned to diagnose the problem to originate from either the code, a stale docker container, or a networking issue. Restarting Docker often restored the development environment and became an important part of my debugging workflow.
          </Paragraph>
          <div className="w-full h-auto flex flex-col lg:flex-row items-start 3xl:gap-10 lg:gap-8">
            <div className="w-full h-auto flex-1 flex-center">
              <div className="left-content flex flex-col gap-2 w-full h-auto">
                <p className={cn("paragraph uppercase indent-0 text-neutral-300 dark:text-neutral-400 text-[15px] font-extrabold tracking-wide")} style={{ fontFamily: SPStoryTheme.font }}>
                  Multi Repo Architecture
                </p>
                <StoryFigure
                  src="/images/stories/supplypike/core-architecture.png"
                  alt="core architecture diagram"
                  className="scale-95"
                  desc="Figure 2. Core multi-repo architecture"
                  scaleMultiplier={0.9}
                />
              </div>
            </div>
            <div className="right-content w-full h-full flex-2">
              <div className="w-full h-full flex flex-col gap-4 mt-4">
                <Paragraph>
                  The core architecture is a multi-repo codebase shared across all SupplyPike engineering teams. It provides the user interface for all client and admin pages. The core team also maintains the application’s shared sidebar wrapper, which serves as the navigation for the entire website.
                </Paragraph>
                <Paragraph>
                  The core team is the oldest repository at SupplyPike. Consequently, the legacy code contains vanilla CSS, plain JavaScript, and many depreciated (discontinued) packages. One of my responsibilities was migrating a deprecated package to its modern replacement. To do this, I identified all instances or inconsistencies of the old package across all files throughout the codebase and replaced them with the new version. This experience taught me that ongoing maintenance and modernization are essential to ensuring the longevity of a software application.
                </Paragraph>
                <Paragraph>
                  The Core Endpoint repository served as the backend API and the entry point to the MongoDB database for all admins and users. Within this repo, I exposed new backend routes to extract the required data necessary from the database. I used API development tools, such as Bruno and Postman, to develop, test, and validate new endpoints. Before submitting each change, I implemented and ran integration tests to verify that the new routes behaved correctly and did not introduce regressions into the existing API.
                </Paragraph>
                <Paragraph>
                  Core Auth was responsible for authenticating users and managing access to protected routes throughout the application.In any login-based application, users must be authenticated before accessing restricted pages, such as the dashboard page. The authentication service also handled user account creation and management (by querying the core-endpoint).
                </Paragraph>
                <Paragraph>
                  Finally, the Revloss repository is its own full-stack application with a Postgres database. The repo was used to display the revenue metrics dashboard for logged in users. I worked on this repo briefly when making a formatter to round numbers to the nearest dollar.
                </Paragraph>
              </div>
            </div>
          </div>
          <div className="w-full h-auto flex flex-col gap-4">
            <Paragraph title="Git Continuous Deployment">
              The Core team followed a continuous deployment workflow, where approved pull requests were automatically deployed to production after passing the required checks. Before each merge, all integration tests run to ensure that the commit won’t break other parts of the repository. On the rare occasion that an issue reached production despite these safeguards, the team would perform a rollback by reverting the deployment to a previously stable version.
            </Paragraph>
            <Paragraph>
              During my internship, I experienced an instance where my changes introduced regressions that were not caught during testing. The issues were pretty quickly identified by an admin, and a rollback would occur while I investigated the root cause. This experience reinforced the importance of thoroughly testing changes, keeping my branch synchronized with the latest changes from the main branch, and merging pull requests earlier in the day so there was sufficient time to identify and resolve any unexpected production issues before the end of the workday.
            </Paragraph>
          </div>
          <div className="w-full h-auto flex flex-col gap-4">
            <Paragraph title="Debugging">
              Debugging big multi-repo codespaces can be overwhelming at first. During my time at SupplyPike, I learned how to quickly and methodically approach a bug. Here are a couple ways to approach a bug. 
            </Paragraph>

            <Callout icon="🔎" text="Use UI as the entry point" className="my-1" theme={SPStoryTheme} />

            <Paragraph>
              Look for searchable text on the page. Whether I was debugging an issue or implementing a new feature, I would identify a unique piece of visible text in the UI and search for it in the repository to find the corresponding component or page. If no searchable text exists, look for distinctive UI elements (brightly colored components, carousels, icons, or other recognizable visual cues) to narrow down the search. As a last resort, use Copilot to help identify the file that contains the relevant component or bug.
            </Paragraph>

            <Callout icon="🧠" text="Think in React" className="my-1" theme={SPStoryTheme} />

            <Paragraph>
              Reason in components, props, state, and data flow. My previous experience with React made it easier to recognize reusable components, mapped data, and common component patterns. Approaching problems from this perspective significantly reduced the time it took to trace bugs back to their source. 
            </Paragraph>
            <Paragraph>
              My typical workflow involved navigating the component tree by Command-clicking into components, identifying key variables, and skimming files to find every reference of that variable. This helps me identify where the variable originated, where it is used in hooks and JS logic, and ultimately where it is rendered in the JSX (JavaScript Executable).
            </Paragraph>

            <Callout icon="💡" text="Isolate the bug" className="my-1" theme={SPStoryTheme} />

            <Paragraph>
              Recreate the issue in a separate project to determine whether the bug is local or contextual.  If the component works in isolation, the bug is in the interaction, not the component itself. While I was implementing my features, I had a separate local repository where I would implement and test components. Here, I would develop the self-contained component properties (state, css, interactability). Once a had a functionally solid component, I would transfer it over to the core repository. Even if I did get bugs when hooking up the component, I knew that none of them were self-contained bugs, but rather interactability bugs. I use this isolating developing technique every time I program in a complex codespace, including this website.
            </Paragraph>
            <Paragraph>
              Debugging requires using every source of information available—not just the code editor. While reading the code is important, many bugs become much easier to diagnose by examining the application's runtime behavior. Throughout my internship, I regularly inspected backend logs, verified that the required Docker containers were running, and used browser developer tools to gather additional clues. Browser DevTools was especially valuable for tracing issues. The Network tab helped identify failed API requests, the Elements panel allowed me to inspect rendered components and their properties, and Local Storage and Cookies made it easy to verify authentication tokens and client-side state. When necessary, I supplemented these tools with
              {" "}
              <CodeText text="console.log()" className="" />
              {" "}
              statements and debugger breakpoints to step through the execution flow and understand how data moved through the application. For more complex bugs, I found it helpful to sketch the sequence of method calls and the flow of data, making it easier to reason about where the application diverged from the expected behavior.
            </Paragraph>
          </div>
        </div>
      </StoryText>
    </div>
  )
}

const ConclusionSection = () => {

  return (
    <div id="conclusion" className="conclusion-section w-full h-full mt-8">
      <StoryText
        className=""
        title="conclusion"
        cols={1}
        storyTheme={SPStoryTheme}
      >
        <Paragraph>
          My twelve-week internship at SupplyPike gave me a firsthand look at what it is like to work as a professional software engineer. Throughout the internship, I participated in sprint planning, daily standups, code reviews, and design decisions while collaborating closely with experienced engineers. Receiving continuous feedback on my pull requests and features taught me how to communicate technical decisions, iterate on solutions, and contribute effectively as part of an engineering team.
        </Paragraph>
        <Paragraph className="mt-4">
          From a technical perspective, I gained experience developing and maintaining full-stack features within a large, multi-repository codebase. I worked with React, TypeScript, MongoDB, REST APIs, Docker, Git, and integration testing while contributing features that improved the experience of both admins and clients. Just as importantly, I learned how to navigate legacy systems and debug complex issues across multiple services.
        </Paragraph>
        <Paragraph className="mt-4">
          Looking back, the most valuable takeaway was learning how to think like a software engineer—not just how to write code, but how to reason through problems, communicate technical decisions, and build reliable software that other engineers can confidently maintain. The experience gave me the confidence to contribute to large-scale production systems and laid a strong foundation for my future career in software engineering.
        </Paragraph>
      </StoryText>
    </div>
  )
}

const BottomSection = () => {

  return (
    <div className="bottom-section w-full h-20 sm:h-40">

    </div>
  )
}

export const Paragraph = ({ className, children, title }: { className?: string, children: React.ReactNode, title?: string }) => {
  
  return (
    <div className="flex flex-col gap-2">
      {title && (
          <p className={cn("paragraph uppercase indent-0 text-neutral-300 dark:text-neutral-500 text-[15px] font-extrabold tracking-wide", className)} style={{ fontFamily: SPStoryTheme.font }}>
            {title}
          </p>
      )}
      <p className={cn("paragraph indent-4 text-inherit text-md font-semibold", "text-(" + SPStoryTheme.pText + ")", className)} style={{ fontFamily: SPStoryTheme.font }}>
        {children}
      </p>
    </div>
  )
}

export default SupplyPikeStory