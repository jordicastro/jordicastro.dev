"use client"

import { Check, Copy } from "lucide-react"
import { Paragraph } from "../SupplyPikeStory"
import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from 'gsap/all';
import { cn } from "@/lib/utils";
import StoryFigure from "../../../StoryFigure";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

const OtpCountdown = () => {
  return (
    <div className="w-full h-auto section-content flex flex-col items-start gap-8">
      <OtpDemo />
      <Paragraph>
        Added an OTP countdown to the admin page to ensure a “fresh” token is used for each client account.
      </Paragraph>
      <Paragraph title="The problem">
        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
      </Paragraph>
      <Paragraph title="The solution">
        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. 
      </Paragraph>
      <div className="columns-1 lg:columns-2 w-full h-auto ">
        <Paragraph title="TOTP & State">
          Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
        </Paragraph>
        <StoryFigure src="/images/stories/supplypike/otp-code-figure-mock.png" alt="otp-code-figure-mock" className="" desc="Figure 1: Showing a Page Component in Next.js" />
        <Paragraph>
          lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
        </Paragraph>
      </div>
    </div>
  )
}

const OtpDemo = () => {
  const scope = useRef<HTMLDivElement>(null);
  const [otp, setOtp] = useState("282835");
  const [hasCopied, setHasCopied] = useState(false);
  const copyTl = useRef<gsap.core.Timeline | null>(null);
  const customCursorHover = !hasCopied ? "pointer" : "default";

  const getRandomOtp = () => {
    return gsap.utils.random(100000, 999999, 1).toString();
  }

  const setRandomOtp = () => {
    setOtp(getRandomOtp());
  }

  const refreshOTP = () => {
    const otpText = scope.current?.querySelector(".otp-text") as HTMLSpanElement | null;
    const otpTextNext = scope.current?.querySelector(".otp-text-next") as HTMLSpanElement | null;
    
    if (!otpText || !otpTextNext) return;

    const nextOtp = getRandomOtp();
    otpTextNext.textContent = nextOtp;

    gsap.timeline({ defaults: { duration: 0.2, ease: "power1.inOut"}})
    .fromTo(otpText, {
      autoAlpha: 1,
      scaleX: 1,
    }, {
      autoAlpha: 0,
      scaleX: 0.9,
    })
    .fromTo(otpTextNext, {
      autoAlpha: 0,
      scaleX: 0.9,
    }, {
      autoAlpha: 1,
      scaleX: 1,
      rotateX: 0,
    }, "<")

    .set(otpText, {
      autoAlpha: 1,
      scaleX: 1,
    })
    .set(otpTextNext, {
      autoAlpha: 0,
      scaleX: 0.9,
    })
    .call(() => {
      setOtp(nextOtp);
    })
  }

  const copyWithFallback = async (text: string) => {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    const didCopy = document.execCommand("copy");
    document.body.removeChild(textArea);

    return didCopy;
  }

  // timeout of 3 seconds to reset copy icon
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasCopied) {
      timer = setTimeout(() => {
        setHasCopied(false);
        copyTl.current?.reverse()
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    }
  }, [hasCopied])

  // transition from copy and check icon on click
  useGSAP(() => {
    const root = scope.current;
    if (!root) return;

    const copyIcon = root.querySelector(".copy-icon");
    const checkIcon = root.querySelector(".check-icon");
    // initially set random otp
    setRandomOtp();
    
    if (!copyIcon || !checkIcon) return;

    gsap.set(checkIcon, { autoAlpha: 0, scale: 0.8 });

    copyTl.current = gsap.timeline({ paused: true })
    .fromTo(copyIcon, {
      autoAlpha: 1,
      scale: 1
    }, {
      autoAlpha: 0,
      scale: 0.8,
      ease: "back.out(1.7)",
      duration: 0.3,
    })
    .fromTo(checkIcon, {
      autoAlpha: 0,
      scale: 0.8
    }, {
      autoAlpha: 1,
      scale: 1,
      ease: "back.in(1.7)",
      duration: 0.3,
    }, "<")

  }, {scope, dependencies: []})

  const copyText = async () => {
    try {
      const didCopy = await copyWithFallback(otp);
      if (!didCopy) return;

      setHasCopied(true);
      copyTl.current?.restart();
    } catch (error) {
      console.error("Failed to copy OTP", error);
    }
  }

  return (
    <div ref={scope} className="otp-demo-wrapper w-full h-auto flex-center">
      <div className="otp-demo w-7/8 sm:w-95 h-30 border border-bg-secondary bg-bg-primary/75 rounded-lg flex flex-col items-start py-2 px-3 gap-0.5 my-2">
        <Paragraph className="text-sm indent-0">
          OTP
        </Paragraph>
        <div className="otp-box relative w-7/8 h-10 border border-neutral-300 dark:border-neutral-800 rounded-sm flex-start px-2 overflow-hidden">
          <div className="absolute inset-0 m-0.75 z-10 bg-bg-secondary/45 rounded-sm"/>
          <Paragraph className="indent-0 otp-text">
            {otp}
          </Paragraph>
          <Paragraph className="absolute indent-0 otp-text-next hidden">
            {otp}
          </Paragraph>
          <div
            className={cn(
              "box-icons w-6 h-6 abs-y-center right-2 flex-center z-11 text-text-secondary",
              !hasCopied ? "cursor-pointer" : "cursor-default"
            )}
            role="button"
            data-cursor={customCursorHover}
            onClick={copyText}
          >
            <Copy className="abs-center copy-icon w-4 h-4 text-inherit"/>
            <Check className="abs-center check-icon w-4 h-4 text-inherit" />
          </div>
        </div>
        <div className="otp-countdown-text w-auto h-12 flex flex-row items-center justify-start gap-2 mt-0">
          <Paragraph className="text-sm indent-0">
              Resets in
          </Paragraph>
            <OTPCountdownTimer onCountdownReset={refreshOTP}/>
        </div>
      </div>
    </div>
  )
}

const OTPCountdownTimer = ({ onCountdownReset }: { onCountdownReset?: () => void }) => {
  const scope = useRef<HTMLDivElement>(null);
  const countdownRingPath = "M 16 2 A 14 14 0 0 0 16 30 A 14 14 0 0 0 16 2";
  const ringProgressTl = useRef<gsap.core.Timeline | null>(null);
  const duration = 30;
  const tickTweenDuration = 0.24;
  const [seconds, setSeconds] = useState(duration);
  const secondsRef = useRef(duration);

  useGSAP(() => {
    const root = scope.current;
    if (!root) return;

    const ringProgress = root.querySelector(".otp-countdown-ring-progress");
    const timerSecs = root.querySelector(".timer-secs") as HTMLSpanElement | null;

    if (!ringProgress || !timerSecs) return;

    let tickTimeout: number | null = null;
    let tickNumber = 1;
    const startTime = performance.now();

    const runTick = () => {
      const nextSeconds = secondsRef.current === 1 ? duration : secondsRef.current - 1;
      const nextDrawSVG = nextSeconds === duration
        ? "100%"
        : `${(nextSeconds / duration) * 100}%`;

      secondsRef.current = nextSeconds;
      timerSecs.textContent = String(nextSeconds);
      setSeconds(nextSeconds);

      ringProgressTl.current?.kill();

      if (nextSeconds === duration) {
        gsap.timeline()
        .to(ringProgress, { drawSVG: "100%", duration: 0.3, ease: "power2.out", overwrite: true })

          ringProgressTl.current = null;
          onCountdownReset?.();

      } else {
        ringProgressTl.current = gsap.timeline()
        .to(ringProgress, {
          drawSVG: nextDrawSVG,
          duration: tickTweenDuration,
          ease: "power2.out",
        });
      }
    };

    const scheduleNextTick = () => {
      const targetTime = startTime + tickNumber * 1000;
      const delay = Math.max(0, targetTime - performance.now());

      tickTimeout = window.setTimeout(() => {
        runTick();
        tickNumber += 1;
        scheduleNextTick();
      }, delay);
    };

    secondsRef.current = duration;
    timerSecs.textContent = String(duration);
    scheduleNextTick();

    return () => {
      if (tickTimeout !== null) {
        window.clearTimeout(tickTimeout);
      }
      ringProgressTl.current?.kill();
      ringProgressTl.current = null;
    }
  }, { scope, dependencies: [] })


  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const ringProgress = root.querySelector(".otp-countdown-ring-progress");

      if (!ringProgress) return;

      gsap.set(ringProgress, { drawSVG: "100%" });

    },
    { scope, dependencies: []}
  )

  return (
    <div ref={scope} className="otp-countdown-timer relative w-7.5 h-7.5 flex-center text-xs text-text-primary">
      <svg
        viewBox="0 0 32 32"
        className="absolute inset-0 w-full h-full"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="otp-countdown-ring-track"
          d={countdownRingPath}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.18"
        />
        <path
          className="otp-countdown-ring-progress"
          d={countdownRingPath}
          stroke="var(--sp-blue)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="timer-secs relative z-10">{seconds}</span>
    </div>
  )
}

export default OtpCountdown