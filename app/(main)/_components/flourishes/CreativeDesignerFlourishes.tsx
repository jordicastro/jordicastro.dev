"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PenTool, Plus as CrossHairCursor, Pointer as PointerCursor, Type, Menu, Hand, HandGrab } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { BlueSquiggle, BoldIcon, CustomGrab, CustomHand, CustomPointer, DownIcon, DragIcon, FontIcon, ItalicIcon, TextSizeIcon, UnderlineIcon, UpIcon } from "@/components/svgs/svgs";
import { FlourishBuilder, FlourishRegisterProps } from "@/types/types";
import { CSSPlugin, CustomBounce, CustomEase, Draggable, DrawSVGPlugin, InertiaPlugin, MotionPathPlugin } from "gsap/all";
import TypewriterText from "@/components/TypewriterText";
import { cn, getElCenter } from "@/lib/utils";
import { cursorThemeCn } from "@/constants/constants";
import { useTheme } from "next-themes";

type cursorObjType = {
    cursorWrapper: HTMLElement;
    cursorRect: DOMRect;
    cursorOriginX: number;
    cursorOriginY: number;
}

type fontsArr = ("Mono" | "Inter" | "Sans" | "Serif")[];

const EditTextFlourish = ({ flourishKey, register, iteration }: FlourishRegisterProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const cursorStepDuration = 1.75;
    const typewriterAnimRef = useRef<Record<string, FlourishBuilder>>({});
    const [isMobile, setIsMobile] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const isMobileRef = useRef(false);
    const { resolvedTheme } = useTheme();
    const themeStyles = useMemo(() => resolvedTheme === "light"
        ? {
            staticTextColor: "#262626",
            borderThemeColor: "#d4d4d4",
            toBorderColor: "#a1a1a1",
        }
        : {
            staticTextColor: "#e5e5e5",
            borderThemeColor: "#404040",
            toBorderColor: "#262626",
        }, [resolvedTheme]);
    const themeStylesRef = useRef(themeStyles);
    themeStylesRef.current = themeStyles;
    // typography popover states
    const [colorIndex, setColorIndex] = useState(0);
    const textColorArr = [
        "#FFFFFF", // neutral, just white for now
        "#FF6467", // red
        "#00c951", // green
        "#2B7FFF", // blue
        "#6F79E8", // indigo
    ]
    const [isBold, setIsBold] = useState(false);
    const [textSize, setTextSize] = useState(36);
    const textSizeRef = useRef(36);
    const fontArr = ["Mono", "Inter", "Sans", "Serif"] as fontsArr;
    const currFontRef = useRef<fontsArr[number]>("Mono");
    const nextFontRef = useRef<fontsArr[number] | null>("Serif");
    const typographyTlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        setupEditTextFlourish();
    }, [iteration]);

    let mm = gsap.matchMedia(scopeRef);
    
    const registerTypewriterAnimation = useCallback((key: string, build: FlourishBuilder) => {
        typewriterAnimRef.current[key] = build;
    }, []);
    const pathNodePos = [
        "-top-1 -left-1",
        "-top-1 -right-1",
        "-bottom-1 -left-1",
        "-bottom-1 -right-1"
    ]

    gsap.registerPlugin(useGSAP, MotionPathPlugin, CustomEase);
    gsap.registerEffect({
        name: "click",
        effect: (targets: gsap.TweenTarget, config: { scaleFrom?: number, scaleTo?: number, duration?: number, ease?: gsap.EaseString | gsap.EaseFunction }) => {
            const tl = gsap.timeline();
            tl.fromTo(targets, {
                scale: config.scaleFrom ?? 1,
            }, {
                scale: config.scaleTo ?? 0.8,
                duration: config.duration ?? 0.15,
                ease: config.ease ?? CustomEase.create("click", "M0,0 C0,0 0.5,1 0.5,1 0.5,1 1,0 1,0 "),
                overwrite: false,
            })

            return tl;
        }
    })

    useGSAP(() => { // change gsap owned colors when theme changes (gsap owns these colors so the color transitions are smooth)
        const container = scopeRef.current;
        if (!container) return;
        const staticTextEl = gsap.utils.toArray<HTMLElement>(".static-text-el", container)[0];
        const colorTextEl = gsap.utils.toArray<HTMLElement>(".color-text-item", container)[0];
        const typographyTl = typographyTlRef.current;
        const { staticTextColor, borderThemeColor } = themeStylesRef.current;
        if (!staticTextEl || !colorTextEl || !typographyTl) return;

        if (typographyTl.time() < typographyTl.labels["before-initial-color-click"]) { // only allow the color theme change before the initial colors are animated onto staticTextEl
            gsap.set(staticTextEl, { color: staticTextColor });
        }
        gsap.set(colorTextEl, { borderColor: borderThemeColor });
    }, [resolvedTheme, iteration]);

    const { contextSafe } = useGSAP(
        () => {
            if (!isReady) return;
            register(flourishKey, () => {
                const container = scopeRef.current;
                const cursorWrapper = gsap.utils.toArray<HTMLElement>(".edit-text-cursor", container)[0];
                if (!container || !cursorWrapper) {
                    return gsap.timeline();
                }
                const cursorRect = cursorWrapper.getBoundingClientRect();
                const cursorOriginX = cursorRect.left;
                const cursorOriginY = cursorRect.top;
                const cursorObj: cursorObjType
                 = { cursorWrapper, cursorRect, cursorOriginX, cursorOriginY };

                // setup
                setupEditTextFlourish();

                // createTextArea follows the cursorWrapper to create an editText rectangle
                const textAreaTl = buildTextAreaTl(cursorObj);
                // fadeOutCrosshairTl fades out crosshair cursor and sets the wrapper next to the typography popover
                const fadeOutCrosshairTl = buildFadeOutCrosshairTl(cursorObj);
                // typewriterTL animates the dynamic text el and replaces it with the static text el
                const typewriterTl = buildTypewriterTl();
                // typographyPopoverTl animates the typography popover in and the cursor interacting with it while the static text el changes in real time
                const typographyPopoverTl = buildTypographyPopoverTl(cursorObj, isMobile);
                typographyTlRef.current = typographyPopoverTl;
                
                const tl = gsap.timeline({ onComplete: () => {
                    // clean gsap, update states, and allow interactability with the popover (drag.enable && pointer events)
                } });

                tl.add(textAreaTl, 0);
                tl.add(fadeOutCrosshairTl, ">");
                tl.add(typewriterTl, "<=0.5");
                tl.add(typographyPopoverTl, ">") 

                return tl;
            });
        },
        {scope: scopeRef, dependencies: [isReady]}
    )

    const setupEditTextFlourish = contextSafe(() => {
        const container = scopeRef.current;
        if (!container) {
            return gsap.timeline();
        }

        const { staticTextColor, borderThemeColor } = themeStylesRef.current;

        // cursor
        const cursorWrapper = gsap.utils.toArray<HTMLElement>(".edit-text-cursor", container)[0];
        const crosshairCursor = gsap.utils.toArray<HTMLElement>(".crosshair-cursor", container)[0];
        const pointerCursor = gsap.utils.toArray<HTMLElement>(".pointer-cursor", container)[0];
        gsap.set(cursorWrapper, { autoAlpha: 0, scale: 0.8, x: 0, y: 0 });
            gsap.set(crosshairCursor, { autoAlpha: 1 });
            gsap.set(pointerCursor, { autoAlpha: 0 });

        // nodes & border
        const pathNodes = gsap.utils.toArray<HTMLElement>(".path-node", container);
        const borderEl = gsap.utils.toArray<HTMLElement>(".border-el", container)[0];
        gsap.set(pathNodes, { autoAlpha: 0 });
        gsap.set(borderEl, {
            autoAlpha: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            transformOrigin: "top left",
        });

        // static-text-el
        const staticTextEl = gsap.utils.toArray<HTMLElement>(".static-text-el", container)[0];
        const textEl = gsap.utils.toArray<HTMLElement>(".text-el", container)[0];
        const staticTextWrapper = gsap.utils.toArray<HTMLElement>(".static-text-el-wrapper", container)[0];
        if (!staticTextEl || !textEl || !staticTextWrapper) {
            return;
        }
        textSizeRef.current = 36;
        gsap.set(textEl, { autoAlpha: 0 });
        gsap.set(staticTextWrapper, { autoAlpha: 0 });
        gsap.set(staticTextEl, { color: staticTextColor, fontSize: `${textSizeRef.current}px`, fontWeight: 400, clearProps: "fontFamily" });


        // typography popover
        const dragHandle = gsap.utils.toArray<HTMLElement>(".drag-handle", container)[0];
        const popoverTitle = gsap.utils.toArray<HTMLElement>(".popover-title", container)[0] ?? null;
        const typographyPopover = gsap.utils.toArray<HTMLElement>(".typography-popover", container)[0];
        const popoverItems = gsap.utils.toArray<HTMLElement>(".popover-item-el", container);
        const colorTextEl = popoverItems[0];
        const boldTextEl = popoverItems[1];
        const boldTextSVG = boldTextEl.querySelector("path");
        setTextSize(36);

        gsap.set(dragHandle, { autoAlpha: 0 });
        if (popoverTitle) gsap.set(popoverTitle, { autoAlpha: 0 });
        gsap.set(typographyPopover, { autoAlpha: 0, y: 20 });
        gsap.set(popoverItems, { autoAlpha: 0, y: 15 });
        gsap.set(colorTextEl, { borderColor: borderThemeColor });
        gsap.set(colorTextEl.querySelector("span"), { color: "#A1A1A1" });
        gsap.set(boldTextSVG, { stroke: "#A1A1A1" });
        // prev font and curr font
        const fontEl = gsap.utils.toArray<HTMLElement>(".popover-item-el", scopeRef.current)[5];
        const fontTextEl = fontEl?.querySelector<HTMLElement>(".input-arr-el");
        const nextFontEl = fontEl?.querySelector<HTMLElement>(".input-arr-next");
        currFontRef.current = "Mono";
        nextFontRef.current = "Serif";
        if (fontTextEl) {
            fontTextEl.textContent = currFontRef.current;
            gsap.set(fontTextEl, { y: 0 });
        }
        if (nextFontEl) {
            nextFontEl.textContent = nextFontRef.current;
            gsap.set(nextFontEl, { y: 0 });
        }
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 639px)");
        const setMm = () => {
            setIsMobile(mediaQuery.matches);
            isMobileRef.current = mediaQuery.matches;
            setIsReady(true);
        }
        setMm();

    }, []);

    const buildTextAreaTl = contextSafe((cursorObj: cursorObjType) => {
        const container = scopeRef.current;
        if (!container) {
            return gsap.timeline();
        }
        const containerRect = container.getBoundingClientRect();
        const textEl = gsap.utils.toArray<HTMLElement>(".text-el", container)[0];
        const pathNodes = gsap.utils.toArray<HTMLElement>(".path-node", container);
        const borderEl = gsap.utils.toArray<HTMLElement>(".border-el", container)[0];
        const { cursorWrapper, cursorRect, cursorOriginX, cursorOriginY } = cursorObj;


        if (!textEl || !pathNodes || !borderEl || !cursorWrapper) {
            return gsap.timeline();
        }

        const topLeftPoint = {
            x: containerRect.left - cursorOriginX,
            y: containerRect.top - cursorOriginY,
        };
        const bottomRightPoint = {
            x: containerRect.right - cursorOriginX,
            y: containerRect.bottom - cursorOriginY,
        };

        const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });

        // fade in cursor
        tl.to(cursorWrapper, { autoAlpha: 1, scale: 1, duration: 0.5 })
        .to(cursorWrapper, { // motionPath to the container's top-left corner
            motionPath: {
                path: [topLeftPoint]
            },
            duration: cursorStepDuration,
        }, ">")
        .add(gsap.effects.click(cursorWrapper, {}), ">") // click
        .call( () => { // set the borderEl autoAlpha 1
            gsap.set(borderEl, { autoAlpha: 1 });
        })
        .to(cursorWrapper, { // motionPath to the container's bottom-right corner
            motionPath: {
                path: [bottomRightPoint]
            },
            duration: cursorStepDuration * 1.2,
        }, "-=0.2")
        .to(borderEl, { // grow the scaleX and scaleY of the border in sync with the cursor motionPath, simulating a drag
            width: "100%",
            height: "100%",
            duration: cursorStepDuration * 1.2,
        }, "<")
        .call( () => { // show pathNodes & text
            gsap.set(pathNodes, { autoAlpha: 1 });
            gsap.set(textEl, { autoAlpha: 1 });

        });

        return tl;
    });

    const buildFadeOutCrosshairTl = contextSafe((cursorObj: cursorObjType) => {
        const container = scopeRef.current;
        if (!container) {
            return gsap.timeline();
        }
        const typographyPopover = gsap.utils.toArray<HTMLElement>(".typography-popover", container)[0];
        const crosshairCursor = gsap.utils.toArray<HTMLElement>(".crosshair-cursor", container)[0];
        const pointerCursor = gsap.utils.toArray<HTMLElement>(".pointer-cursor", container)[0];

        if (!typographyPopover || !crosshairCursor || !pointerCursor) {
            return gsap.timeline();
        }

        const popoverRect = typographyPopover.getBoundingClientRect();
        const popoverCenterY = popoverRect.top + popoverRect.height / 2;
        const { cursorWrapper, cursorOriginX, cursorOriginY } = cursorObj;

        const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });

        tl.to(cursorWrapper, { // move cursor to the side and fade out
            motionPath: {
                path: [
                    { x: -30, y: 30 },
                    { x: -10, y: 15 },
                ],
                relative: true,
                curviness: 2,
            },
            duration: cursorStepDuration,
            delay: 0.5,
            ease: "power1.inOut",
        }, "<")
        .to(cursorWrapper, {
            autoAlpha: 0,
            scale: 0.8,
            duration: 0.5,
        })
        .call( () => { // set the cursor y-center x offset next to the popover, hidden
            const yCenter = popoverCenterY - cursorOriginY
            const xOffset = (popoverRect.x - cursorOriginX) -50
            gsap.set(cursorWrapper, { autoAlpha: 0, x: xOffset, y: yCenter, scale: 1 });
            // change cursor to pointer
            gsap.set(crosshairCursor, { autoAlpha: 0, display: "hidden" });
            gsap.set(pointerCursor, { autoAlpha: 1, display: "block" });
        });

        return tl;
    });

    const buildTypewriterTl = contextSafe(() => {
        const container = scopeRef.current;
        if (!container) {
            return gsap.timeline();
        }
        const typewriterAnim = typewriterAnimRef.current["edit-text-typewriter"]?.();
        const textEl = gsap.utils.toArray<HTMLElement>(".text-el", container)[0];
        const staticTextWrapper = gsap.utils.toArray<HTMLElement>(".static-text-el-wrapper", container)[0];

        if (!typewriterAnim || !textEl || !staticTextWrapper) {
            return gsap.timeline();
        }

        const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });

        if (typewriterAnim) {
            tl.add(typewriterAnim, ">") // animate the text with the typewriterAnim from the TypewriterText component
                    .call( () => {
                        // fade out dynamic text-el and fade in static text-el
                        gsap.set(textEl, { autoAlpha: 0 });
                        gsap.set(staticTextWrapper, { autoAlpha: 1 });
                    });
        } else {
            tl.call( () => {
                // fade out dynamic text-el and fade in static text-el
                gsap.set(textEl, { autoAlpha: 0 });
                gsap.set(staticTextWrapper, { autoAlpha: 1 });
            });
        }

        return tl;
    });

    const buildTypographyPopoverTl = contextSafe((cursorObj: cursorObjType, isMobile: boolean) => {
        const container = scopeRef.current;
        if (!container) {
            return gsap.timeline();
        }

        const typographyPopover = gsap.utils.toArray<HTMLElement>(".typography-popover", container)[0];
        const dragHandle = gsap.utils.toArray<HTMLElement>(".drag-handle", container)[0];
        const popoverTitle = gsap.utils.toArray<HTMLElement>(".popover-title", container)[0] ?? null;
        const popoverItems = gsap.utils.toArray<HTMLElement>(".popover-item-el", container);
        const staticTextEl = gsap.utils.toArray<HTMLElement>(".static-text-el", container)[0];

        if (!typographyPopover || !dragHandle || !popoverItems || !staticTextEl) {
            return gsap.timeline();
        }

        const popoverTargets = isMobile
                    ? [dragHandle, ...popoverItems]
                    : ([popoverTitle, dragHandle, ...popoverItems].filter(Boolean) as HTMLElement[]);
        textSizeRef.current = 36;
        setTextSize(36);

        const colorTextEl = popoverItems[0];
        const colorTextCenter = getElCenter(colorTextEl);
        const boldTextEl = popoverItems[1];
        const boldTextSVG = boldTextEl.querySelector("path");
        const boldTextCenter = getElCenter(boldTextEl);
        const textSizeEl = popoverItems[4];
        const { cursorWrapper, cursorOriginX, cursorOriginY } = cursorObj;
        const yOffset = 20;

        const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });

        tl.to(typographyPopover, { autoAlpha: 1, y: 0, duration: 1 })
                .to(popoverTargets, { autoAlpha: 1, y: 0, duration: 0.75, stagger: { each: 0.05, from: "start" } }, "<=0.25")
                .to(cursorWrapper, { autoAlpha: 1, duration: 0.5 }, "-=0.25")
                .set(cursorWrapper, { zIndex: 1000 }) // ensure cursor is above the popover items
                .to(cursorWrapper, {
                    x: colorTextCenter.x - cursorOriginX,
                    y: colorTextCenter.y - cursorOriginY - yOffset,
                    duration: cursorStepDuration,
                }, ">")
                .to(colorTextEl, { borderColor: () => themeStylesRef.current.toBorderColor, duration: 0.5 }, "-=0.5")
                .addLabel('before-initial-color-click', ">")
                .add(gsap.effects.click(cursorWrapper, {}), ">") // click for red
                .to(colorTextEl.querySelector("span"), { color: "#FF6467", duration: 0.25 }, "<") // change the A text color to red
                .to(staticTextEl, { color: "#FF6467", duration: 0.25 }, "<") // text el change to red

                .add(gsap.effects.click(cursorWrapper, {duration: 0.15}), ">=0.4") // click for green
                .to(colorTextEl.querySelector("span"), { color: "#00c951", duration: 0.25 }, "<")
                .to(staticTextEl, { color: "#00c951", duration: 0.25 }, "<")

                .add(gsap.effects.click(cursorWrapper, {duration: 0.15}), ">=0.1") // click for blue
                .to(colorTextEl.querySelector("span"), { color: "#2B7FFF", duration: 0.25 }, "<")
                .to(staticTextEl, { color: "#2B7FFF", duration: 0.25 }, "<")
                .call(() => { setColorIndex(3);  }) // set to blue

                .to(cursorWrapper, { // hover to bold
                    x: boldTextCenter.x - cursorOriginX,
                    y: boldTextCenter.y - cursorOriginY - yOffset,
                    duration: 0.75,
                }, ">")
                .to(boldTextEl, { backgroundColor: "rgba(115, 115, 115, 0.2)", duration: 0.5 }, "-=0.5") // active hover
                .to(colorTextEl, { borderColor: () => themeStylesRef.current.borderThemeColor, duration: 0.5 }, "<") // reset the colorTextEl border color
                .to(boldTextSVG, { stroke: "#a1a1a1", duration: 0.5 }, "<") // change the bold icon color to onhover
                .add(gsap.effects.click(cursorWrapper, {}), ">") // click bold
                .to(boldTextEl, { backgroundColor: "rgba(20, 71, 230, 0.2)", duration: 0.5 }, "<") // active
                .to(boldTextSVG, { stroke: "#2B7FFF", duration: 0.25 }, "<") // change the bold icon color to active
                .to(staticTextEl, { fontWeight: 700, duration: 0.25 }, "<") // text el change to bold
                // .call(() => { setIsBold(true); }) // set bold state
                if (isMobileRef.current) {
                    // italicize then fade out cursor
                    const italicTextEl = popoverItems[2];
                    const italicCenter = getElCenter(italicTextEl);
                    const italicSVG = italicTextEl.querySelectorAll<SVGSVGElement>("svg path");
                    tl.to(cursorWrapper, {
                        x: italicCenter.x - cursorOriginX,
                        y: italicCenter.y - cursorOriginY - yOffset,
                        duration: 1,
                    })
                    .addLabel('italic-hover', ">")
                    .to(italicTextEl, { backgroundColor: "rgba(115, 115, 115, 0.2)", duration: 0.5 }, "<=0.1") // active hover
                    .add(gsap.effects.click(cursorWrapper, {}), "italic-hover") // click italic
                    .to(staticTextEl, { fontStyle: "italic", duration: 0.25 }, "<") // text el change to italic
                    .to(italicSVG, { stroke: "#2B7FFF", duration: 0.25 }, "<")
                    .to(cursorWrapper, { // move cursor off popover
                        motionPath: {
                            path: [
                                { x: -30, y: 10 },
                                { x: -15, y: 25 },
                            ],
                            relative: true,
                            curviness: 1.5,
                        },
                        duration: cursorStepDuration,
                    })
                    .to(italicTextEl, { backgroundColor: "transparent", clearProps: "backgroundColor", duration: 0.5 }, "<=0.3") // remove active hover

                } else {
                    const upEl = textSizeEl.querySelector<HTMLElement>(".up-el");
                    if (!upEl) {
                        return gsap.timeline();
                    }
                    const upElCenter = getElCenter(upEl);
                    const fontEl = popoverItems[5];
                    const downEl = fontEl.querySelector<HTMLElement>(".down-el");
                    if (!downEl) {
                        return gsap.timeline();
                    }
                    const downElCenter = getElCenter(downEl);

                    tl.to(cursorWrapper, { // hover to text size UP
                        x: upElCenter.x - cursorOriginX + 3,
                        y: upElCenter.y - cursorOriginY - yOffset - 5,
                        duration: 1,
                    }, ">")
                    .to(upEl, { backgroundColor: "rgba(115, 115, 115, 0.2)", duration: 0.5 }, "-=0.5") // active hover
                    .add(gsap.effects.click(cursorWrapper, {}), ">") // click text size up
                    .call(() => incrementTextSize(37))
                    .add(gsap.effects.click(cursorWrapper, {}), ">=0.1") // click text size up
                    .call(() => incrementTextSize(38))

                    .to(cursorWrapper, { // hover to font down
                        x: downElCenter.x - cursorOriginX + 3,
                        y: downElCenter.y - cursorOriginY - yOffset - 5,
                        duration: 1,
                    }, ">")
                    .to(upEl, { backgroundColor: "transparent", clearProps: "backgroundColor", duration: 0.5 }, "<") // remove active hover from upEl
                    .to(downEl, { backgroundColor: "rgba(115, 115, 115, 0.2)", duration: 0.5 }, "-=0.5") // active hover on downEl
                    .add(gsap.effects.click(cursorWrapper, {}), ">") // click font down
                    .add(() => fontDown(), ">")

                    .to(cursorWrapper, { // move cursor away and fade out
                        motionPath: {
                            path: [
                                { x: 30, y: 30 },
                                { x: 5, y: 20 },
                            ],
                            relative: true,
                            curviness: 1.5,
                        },
                        duration: cursorStepDuration,
                    }, ">=0.5")
                    .to(downEl, { backgroundColor: "transparent", clearProps: "backgroundColor", duration: 0.5 }, "<=0.1")
                }
                tl.to(cursorWrapper, { scale: 0.8, autoAlpha: 0, duration: 0.5, ease: "back.in(2)" }, "-=0.5"); // fade out cursor

        return tl;
    });

    const incrementTextSize = contextSafe((nextSize: number) => {
        const staticTextEl = gsap.utils.toArray<HTMLElement>(".static-text-el", scopeRef.current)[0];
        if (!staticTextEl || textSizeRef.current === nextSize) {
            return;
        }

        textSizeRef.current = nextSize;
        gsap.to(staticTextEl, {
            fontSize: `${nextSize}px`,
            lineHeight: "70px",
            duration: 0.25,
            overwrite: "auto",
        });
        setTextSize(nextSize);
    });

    const fontDown = contextSafe(() => {
        const fontEl = gsap.utils.toArray<HTMLElement>(".popover-item-el", scopeRef.current)[5];
        const fontTextEl = fontEl?.querySelector<HTMLElement>(".input-arr-el");
        const nextFontEl = fontEl?.querySelector<HTMLElement>(".input-arr-next");
        const staticTextEl = gsap.utils.toArray<HTMLElement>(".static-text-el", scopeRef.current)[0];

        if (!fontEl || !fontTextEl || !nextFontEl) {
            return;
        }

        const prevFont = currFontRef.current;  // curr is now prev
        const currIndex = fontArr.indexOf(prevFont);
        const nextIndex = currIndex <= 0 ? fontArr.length - 1 : currIndex - 1; // prev backwards
        const currFont = fontArr[nextIndex];

        const tl = gsap.timeline({ onComplete: () => {
            nextFontRef.current = prevFont;
            currFontRef.current = currFont;
        }});
        tl.to(nextFontEl, {
            y: 31,
            duration: 0.5,
            ease: "circ.inOut"
        })
        .to(fontTextEl, {
            y: 31,
            duration: 0.5,
            ease: "circ.inOut",
        }, "<")
        .to(staticTextEl, { fontFamily: currFont, duration: 0.25 }, "<") // change the font of the text el to the new font

    });

    const fontSize = isMobile ? 30 : 36;
    const staticTextWrapperTW = isMobile ? "w-full top-6.5" : "top-3.25 w-87.5 h-35";
    const staticTextLineHeight = isMobile ? "58px" : "70px";

    return isReady && (
        <div ref={scopeRef} className="flourish CD-flourish edit-text-flourish abs-x-center top-32 lg:left-auto lg:translate-x-0 lg:right-64 lg:w-100 sm:w-100 w-75 h-45">
            <div className="w-full h-full relative">
                {/* text */}
                <div className="absolute inset-0 overflow-hidden p-5">
                    <div className={`static-text-el-wrapper abs-x-center ${staticTextWrapperTW}`}>
                        <span className={`static-text-el font-normal font-mono text-text-primary`}  style={{ lineHeight: staticTextLineHeight, fontSize: `${fontSize}px` }}>Some cool text goes here...</span>
                    </div>
                    <TypewriterText text="Some cool text goes here..." parentWidth={300} fontSize={fontSize} speed={0.12} animationKey="edit-text-typewriter" registerAnimation={registerTypewriterAnimation} className="text-el abs-center font-normal z-50" />
                </div>
                {/* border */}
                <div className="border-el absolute w-full h-full border border-blue-500 rounded-none" />
                {/* border nodes */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                        <PathNode i={i} className={cn(pathNodePos[i], "rounded-xs border-0 bg-neutral-50 dark:bg-neutral-950")} />
                    </div>
                ))}
                {/* cross-hair mouse & pointer mouse */}
                <CursorWrapper className="absolute bottom-12 sm:-left-36 -left-24"/>
                {/* typography popover */}
                <TypographyPopover isMobile={isMobile} isBold={isBold} textSize={textSize} inputArr={fontArr}/>
            </div>
        </div>
    )
}

const CursorWrapper = ({ className }: { className?: string }) => {
    const { resolvedTheme } = useTheme();
    const customCursorFill = resolvedTheme === "light"
        ? "oklch(0.92 0.01 255 / 0.25)"
        : "oklch(0.32 0.02 255 / 0.25)";
    return (
        <div className={`edit-text-cursor ${className}`}>
            <CrossHairCursor className={cn("crosshair-cursor w-7 h-7 abs-center", cursorThemeCn)} />
            <CustomPointer className={cn("pointer-cursor w-6 h-6 abs-center hidden", cursorThemeCn)} fill={customCursorFill} />
        </div>
    )

}

const TypographyPopover = ({ isMobile, isBold, textSize, inputArr }: { isMobile: boolean, isBold: boolean, textSize: number, inputArr: fontsArr }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const borderThemeCn = "border-neutral-300 dark:border-neutral-700";
    const bgThemeCn = "bg-neutral-100/80 dark:bg-neutral-900/80";

    return isMobile ? (
        <div
            ref={scopeRef}
            className={cn(
                "flourish typography-popover absolute -top-4 -right-20 w-12 h-auto border-2 backdrop-blur-2xl rounded-[10px] flex flex-col items-center justify-center gap-2",
                borderThemeCn,
                bgThemeCn
        )}>
            <DragHandle className="w-12 h-8 popover-item" />
            <ColorTextItem />
            <TPopoverItem icon={<BoldIcon color={isBold ? "#2b7FFF" : undefined}/>} isActive={isBold}/>
            <TPopoverItem icon={<ItalicIcon />} />
            <TPopoverItem icon={<UnderlineIcon /> } className="mb-2" />
        </div>
    ) : (
        <div
            ref={scopeRef}
            className={cn(
                "typography-popover absolute -bottom-32 -right-24  w-50 h-48 rounded-[10px] border-2 flex flex-col items-center backdrop-blur-2xl",
                borderThemeCn,
                bgThemeCn
            )}>
            {/* popover header */}
            <div className={cn("flex-1 w-full flex items-center justify-between border-b-2", borderThemeCn)}>
                <div className="flex-4 text-center w-auto h-full flex-center">
                    <h1 className="popover-title text-[14px] font-semibold tracking-[8%] text-text-primary select-none">
                        Typography
                    </h1>
                </div>
                <DragHandle className="flex-1"/>
            </div>
            {/* popover content */}
            <div className="flex-3 w-full h-auto flex-col items-center justify-center">
                <div className="w-auto mt-4 mb-4 ml-4 flex flex-row justify-start items-center gap-3">
                    <ColorTextItem />
                    <TPopoverItem icon={<BoldIcon color={isBold ? "#2b7FFF" : undefined}/>} isActive={isBold}/>
                    <TPopoverItem icon={<ItalicIcon />} />
                    <TPopoverItem icon={<UnderlineIcon /> } />
                </div>
                <div className="w-auto mx-4 flex flex-col justify-start items-center gap-3">
                    {/* text size line */}
                    <div className="popover-item-el w-full h-full flex-start gap-4">
                        <TextSizeIcon />
                        <IncrementInput type="number" default={textSize} units="px" min={1} max={99} />
                    </div>
                    {/* font type line */}
                    <div className="popover-item-el font-el w-full h-full flex-start gap-4">
                        <FontIcon />
                        <IncrementInput type="array" inputArr={inputArr} />
                    </div>
                </div>
            </div>
        </div>
    )
}
const DragHandle = ({ className }: { className?: string }) => (
    <div
        className={twMerge(
            `drag-handle w-auto h-full flex-center bg-neutral-300/20 dark:bg-neutral-700/20 rounded-tr-lg`,
            className
        )}
        role="button"
        onClick={() => {}}
        data-cursor="pointer-2"
    >
        <DragIcon color="#a1a1a1"/>
    </div>
)

const ColorTextItem = () => (
    <div className="popover-item-el color-text-item w-8 h-8 rounded-sm border-2 border-neutral-300 dark:border-neutral-700 flex-center hover:border-neutral-200 hover:dark:border-neutral-600">
        <span className="text-[14px] font-mono text-neutral-400 select-none">
            A
        </span>
    </div>
)

const TPopoverItem = ({ icon, isActive, className }: { icon: React.ReactNode, isActive?: boolean, className?: string }) => {
    return (
        <div className={twMerge(
            `popover-item-el w-8 h-8 rounded-sm p-0 flex-center`,
            isActive ? "bg-blue-700/30" : "hover:bg-neutral-500/20",
            className
            )}>
            {icon}
        </div>
    )
}

interface IncrementInputProps {
    type?: string;
    default?: number;
    units?: string;
    min?: number;
    max?: number;
    inputArr?: string[];
}

const IncrementInput = ({ type = "number", default: defaultValue = 0, units = "", min = 0, max = 100, inputArr }: IncrementInputProps) => {
    if (type === "array" && (!inputArr || !inputArr.length)) {
        return;
    }
    const borderThemeCn = "border-neutral-300 dark:border-neutral-700";
    const bgThemeCn = "bg-neutral-300/30 dark:bg-neutral-700/20";
    const hoverThemeCn = "hover:dark:bg-neutral-600/20 hover:bg-neutral-200/20";

    return (
        <div className={cn("w-full h-6 border-2 rounded-sm flex-start overflow-hidden", borderThemeCn)}> 
            {/* increment btns */}
            <div className={cn("w-6 h-6 border-r-2 rounded-sm flex-center-col gap-0", borderThemeCn, bgThemeCn)}>
                <div
                    className={cn("up-el w-full h-full flex-center rounded-t-sm", hoverThemeCn)}
                    role="button"
                    onClick={() => {}}
                >
                    <UpIcon />
                </div>
                <div
                    className={cn("down-el w-full h-full flex-center rounded-b-sm", hoverThemeCn)}
                    role="button"
                    onClick={() => {}}
                >
                    <DownIcon />
                </div>
            </div>
            {/* input */}
            <div className="w-full h-full ml-2 flex-start">
                <div className="font-normal tracking-[5%] text-[14px] w-full text-start">
                    {type === "number" ? (
                        <p className="flex gap-x-1">
                            <span className="input-val">{defaultValue}</span>
                            <span className="input-units">{units}</span>
                        </p>
                    ) : (
                        <div className="relative">
                            <p className="input-arr-next absolute inset-0 -top-7.5 text-[14px]">
                                {inputArr ? (inputArr[inputArr.length - 1]) : "Select an option"}
                            </p>
                            <p className="input-arr-el text-[14px]">
                                {inputArr ? inputArr[0] : "Select an option"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const PenSquiggleFlourish = ({ flourishKey, register, iteration }: FlourishRegisterProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const pathNodePos = [
        "bottom-12 left-0",
        "top-0 left-40",
        "bottom-0 right-30",
        "abs-y-center right-0"
    ]
    const nodeFill = resolvedTheme === "light" ? "#fafafa": "#171717"; // neutral-50 in light, neutral-950 in dark

    useEffect(() => {
        setupPenSquiggleFlourish();
    }, [iteration])

    gsap.registerEffect({
        name: "click",
        effect: (targets: gsap.TweenTarget, config: { scaleFrom?: number, scaleTo?: number, duration?: number, ease?: gsap.EaseString | gsap.EaseFunction }) => {
            const tl = gsap.timeline();
            tl.fromTo(targets, {
                scale: config.scaleFrom ?? 1,
            }, {
                scale: config.scaleTo ?? 0.8,
                duration: config.duration ?? 0.15,
                ease: config.ease ?? CustomEase.create("click", "M0,0 C0,0 0.5,1 0.5,1 0.5,1 1,0 1,0 "),
                overwrite: false,
            })

            return tl;
        }
    })
    gsap.registerEffect({
        name: "popIn",
        effect: (targets: gsap.TweenTarget, config: { scaleFrom?: number, scaleTo?: number, duration?: number, ease?: gsap.EaseString | gsap.EaseFunction, stagger?: gsap.TweenVars["stagger"] }) => {
            const tl = gsap.timeline();
            tl.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out", stagger: config.stagger })
            .fromTo(targets, { scale: config.scaleFrom ?? 0.8}, {
                scale: config.scaleTo ?? 1,
                ease: config.ease ?? CustomEase.create("popIn", "M0,0 C0.046,0.091 0.35,0.895 0.5,1.1 0.789,0.822 0.72,0.895 1,1 "),
                stagger: config.stagger,
                duration: config.duration ?? 0.5,
            }, "<");
            return tl;
        }
    })

    gsap.registerPlugin(useGSAP, DrawSVGPlugin, MotionPathPlugin, CustomEase);

    const { contextSafe } = useGSAP(
        () => {
            register(flourishKey, () => {
                const pathNodes = gsap.utils.toArray<HTMLElement>(".path-node", scopeRef.current);
                const pathEdges = gsap.utils.toArray<SVGLineElement>(".path-edge", scopeRef.current);
                const penTool = gsap.utils.toArray<HTMLElement>(".pen-tool", scopeRef.current)[0];
                const container = scopeRef.current!.querySelector<HTMLElement>(".pen-squiggle-flourish")!
                const blueSquigglePath = scopeRef.current!.querySelector<SVGPathElement>(".blue-squiggle-path")!
                if (!pathNodes || !pathEdges || !penTool || !container || !blueSquigglePath) {
                    return null;
                }
                // setup:
                setupPenSquiggleFlourish();

                // get the points of the pathNodes to animate the PenTool through those points with MotionPathPlugin
                // points are relative to the top-left corner of the penTool
                const penStepDuration = 1.75;
                const penRect = penTool.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const penCX = penRect.left;
                const penCY = penRect.top;
                const points = pathNodes.map((node) => {
                    const r = node.getBoundingClientRect();
                    return {
                        x: (r.left + r.width / 2) - penCX,
                        y: (r.top + r.height / 2) - penCY,
                    }
                })
                const interpolatedPoints = getInterpolationPoints(points);

                // position each SVG line between consecutive nodes (coords relative to container)
                pathEdges.forEach((line, i) => {
                    const fromX = points[i].x + penCX - containerRect.left;
                    const fromY = points[i].y + penCY - containerRect.top;
                    const toX = points[i + 1].x + penCX - containerRect.left;
                    const toY = points[i + 1].y + penCY - containerRect.top;
                    line.setAttribute("x1", String(fromX));
                    line.setAttribute("y1", String(fromY));
                    line.setAttribute("x2", String(toX));
                    line.setAttribute("y2", String(toY));
                });

                // penTool goes through and adds nodes to the path
                const penToolPathTl = gsap.timeline({ defaults: { ease: "power1.inOut" } });
                // the penTool goes off the path, penTool and nodes fade out
                const transitionTl = gsap.timeline();
                // the squiggly rounded cap animates in :)
                const squiggleTl = gsap.timeline();

                // fade the penTool in
                penToolPathTl.fromTo(penTool, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power1.inOut" });

                // animate penTool through each path in a foreach loop
                pathNodes.forEach((node, i) => {
                    penToolPathTl.to(penTool, {
                        motionPath: {
                            path: [
                                // a point next to the point so it curves a little
                                { x: interpolatedPoints[i].x, y: interpolatedPoints[i].y },
                                { x: points[i].x, y: points[i].y }
                            ],
                            curviness: 2,
                        },
                        duration: penStepDuration,
                        delay: i === 0 ? 0 : 0.25,
                    })
                    penToolPathTl.add(gsap.effects.click(penTool, {}), ">")
                    .set(pathNodes[i], { autoAlpha: 1, backgroundColor: "#2B7FFF" });
                    if (i > 0) {
                        penToolPathTl.set(pathNodes[i - 1], { backgroundColor: nodeFill }, "<");
                    }
                    // reveal the edge connecting the previous node to this one (no edge for i=0)
                    if (i > 0) {
                        penToolPathTl.to(pathEdges[i - 1], { drawSVG: "100%", duration: 0.05, ease: "power1.inOut" }, "<");
                    }
                })

                transitionTl.to(penTool, {
                    motionPath: {
                        path: [
                            { x: 45, y: 25 },
                            { x: 15, y: 25 }
                        ],
                        relative: true,
                        curviness: 2,
                    },
                    duration: penStepDuration,
                    delay: 0.5,
                    ease: "power1.inOut"
                })
                .to(penTool, {
                        autoAlpha: 0,
                        scale: 0.8,
                        duration: 0.5,
                        ease: "back.in(2)",
                    }, ">")
                .to(pathNodes, {
                    autoAlpha: 0,
                    scale: 0.8,
                    duration: 1,
                    transformOrigin: "center center",
                    ease: "back.out(2)",
                    stagger: {
                        each: 0.05,
                        from: "start",
                    }
                }, "-=0.25")
                .to(pathEdges, {
                    autoAlpha: 0,
                    scale: 0.8,
                    duration: 1,
                    transformOrigin: "center center",
                    ease: "back.out(2)",
                    stagger: {
                        each: 0.05,
                        from: "start",
                    }
                }, "<=0.025");

                squiggleTl.to(blueSquigglePath, {
                    drawSVG: "100%",
                    duration: 2.5,
                    ease: "sine.inOut",
                })

                const tl = gsap.timeline();
                tl.add(penToolPathTl, 0);
                tl.add(transitionTl, ">");
                tl.add(squiggleTl, "-=1.4"); // 1.2 total, so .2 overlap
                return tl;
            });

        }, {scope: scopeRef, dependencies: []}
    )

    const setupPenSquiggleFlourish = contextSafe(() => {
        const pathNodes = gsap.utils.toArray<HTMLElement>(".path-node", scopeRef.current);
        const pathEdges = gsap.utils.toArray<SVGLineElement>(".path-edge", scopeRef.current);
        const penTool = gsap.utils.toArray<HTMLElement>(".pen-tool", scopeRef.current)[0];
        const blueSquigglePath = scopeRef.current!.querySelector<SVGPathElement>(".blue-squiggle-path")!

        gsap.set(pathNodes, { autoAlpha: 0, backgroundColor: nodeFill });
        gsap.set(pathEdges, { drawSVG: "0%" });
        gsap.set(penTool, { autoAlpha: 0, x: 0, y: 0 });
        gsap.set(blueSquigglePath, { drawSVG: "0%" });
    });

    const getInterpolationPoints = (points: { x: number, y: number }[]) => {
        // returns one control point per segment
        const allPoints = [{ x: 0, y: 0 }, ...points];
        const controlPoints = [];
        for (let i = 0; i < allPoints.length - 1; i++) {
            const p1 = allPoints[i];
            const p2 = allPoints[i + 1];
            // midpoint with a left -x to force a curve (straight paths have curviness=0)
            controlPoints.push({
                x: (p1.x + p2.x) / 2 - 40,
                y: (p1.y + p2.y) / 2,
            });
        }
        return controlPoints;
    }

    return (
        <div className="relative abs-x-center w-0 h-full hidden md2:block" ref={scopeRef}>
            <div className="flourish CD-flourish pen-squiggle-flourish w-100 h-40 absolute bottom-20 lg:-left-125 right-4">
                {/* SVG overlay — lines are positioned at runtime by GSAP from getBoundingClientRect */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <line
                            key={i}
                            className={`path-edge path-edge-${i}`}
                            x1="0" y1="0" x2="0" y2="0"
                            stroke="#a3a3a3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    ))}
                </svg>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                        <PathNode i={i} className={pathNodePos[i]} />
                    </div>
                ))}
                <PenTool className={cn("pen-tool w-7 h-7 absolute bottom-4 left-24", cursorThemeCn)}/>
                <div className="absolute inset-0 overflow-visible">
                    <BlueSquiggle />
                </div>
            </div>
        </div>
    )
}

interface PathProps {
    className?: string;
    i: number;
}
const PathNode = ({ className, i }: PathProps) => {
    return (
        <div className={`path-node absolute w-3 h-3 border-2 border-blue-500 rounded-full path-node-${i} ${className}`} />
    )
}

const GridFlourish = ({ flourishKey, register, iteration }: FlourishRegisterProps) => { // TODO: replace with version of logo bounce
    const scopeRef = useRef<HTMLDivElement>(null);
    const gridHeadPos = [
        "top-5 left-8",
        "top-2 right-10",
        "top-18 left-26",
        "top-26 right-6",
        "bottom-24 left-1",
        "bottom-14 left-20",
        "bottom-1 left-6",
        "bottom-6 right-10",
    ]

    useEffect(() => {
        setupGridFlourish();
    }, [iteration])
    
    gsap.registerPlugin(useGSAP, CustomEase);
    gsap.registerEffect({
        name: "popIn",
        effect: (targets: gsap.TweenTarget, config: { scaleFrom?: number, scaleTo?: number, duration?: number, ease?: gsap.EaseString | gsap.EaseFunction, stagger?: gsap.TweenVars["stagger"] }) => {
            const tl = gsap.timeline();
            tl.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out", stagger: config.stagger })
            .fromTo(targets, { scale: config.scaleFrom ?? 0.8}, {
                scale: config.scaleTo ?? 1,
                ease: config.ease ?? CustomEase.create("popIn", "M0,0 C0.046,0.091 0.35,0.895 0.5,1.1 0.789,0.822 0.72,0.895 1,1 "),
                stagger: config.stagger,
                duration: config.duration ?? 0.5,
            }, "<");
            return tl;
        }
    })

    const { contextSafe } = useGSAP(
        () => {
            register(flourishKey, () => {
                const gridContainer = gsap.utils.toArray<HTMLElement>(".grid-container", scopeRef.current)[0];
                const gridHeads = gsap.utils.toArray<HTMLElement>(".grid-head", scopeRef.current);
                if (!gridContainer || !gridHeads) {
                    return null;
                }

                const tl = gsap.timeline();
                tl.add(gsap.effects.popIn(gridContainer, { scaleFrom: 1.2 }), 0)
                .add(gsap.effects.popIn(gridHeads, { scaleFrom: 0.8, stagger: 0.1 }), "-=0.25")

                

                return tl;
            });
        }, 
        {scope: scopeRef, dependencies: []}
    );

    const setupGridFlourish = contextSafe(() => {
        const gridHeads = gsap.utils.toArray<HTMLElement>(".grid-head", scopeRef.current);
        const gridContainer = gsap.utils.toArray<HTMLElement>(".grid-container", scopeRef.current)[0];
        var randomRotation = gsap.utils.random(-360, 360, 10, true);

        gridHeads.forEach((head) => {
            gsap.set(head, { rotation: randomRotation(), transformOrigin: "center" });
        });
    });

    return (
        // relative to the section heading pseudo wrapper
        <div className="relative abs-center w-1/2 h-0 hidden wide:block" ref={scopeRef}>
            <div className="flourish CD-flourish grid-flourish abs-y-center -left-84 w-64 h-64">
                <Grid className="p-1">
                    {Array.from({ length: 8}).map((_, i) => (
                        <Image
                            key={i}
                            src="/images/JordPle.png"
                            alt="logo"
                            width={48}
                            height={48}
                            className={`grid-head absolute pointer-events-auto select-none ${gridHeadPos[i]}`} 
                            draggable={false}
                        />
                    ))}
                </Grid>
            </div>
        </div>
    )
}

interface GridProps {
    row?: number;
    col?: number;
    color?: string;
    children?: React.ReactNode; 
    className?: string;

}
const Grid = ({ row=16, col=16, color="#737373", children, className }: GridProps) => {

    return (
        <div className="relative w-64 h-64 grid grid-cols-16 grid-rows-16 grid-container">
        {Array.from({ length: 256 }).map((_, i) => (
            <div key={i} className="w-4 h-4 border border-neutral-500/25" />
        ))}
            <div className={`absolute inset-0 pointer-events-none ${className}`}>
                {children}
            </div>
        </div>
    )
}

const BounceTimelineFlourish = ({ flourishKey, register, iteration }: FlourishRegisterProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const boxTlRef = useRef<gsap.core.Timeline | null>(null);
    const draggablePlayheadRef = useRef<Draggable | null>(null);

    useEffect(() => {
        setupBounceTimelineFlourish();
    }, [iteration]);

    gsap.registerPlugin(useGSAP, CustomEase, MotionPathPlugin, CustomBounce, Draggable, InertiaPlugin, CSSPlugin);
    gsap.registerEffect({
        name: "popIn",
        effect: (targets: gsap.TweenTarget, config: { scaleFrom?: number, scaleTo?: number, duration?: number, ease?: gsap.EaseString | gsap.EaseFunction, stagger?: gsap.TweenVars["stagger"] }) => {
            const tl = gsap.timeline();
            tl.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out", stagger: config.stagger })
            .fromTo(targets, { scale: config.scaleFrom ?? 0.8}, {
                scale: config.scaleTo ?? 1,
                ease: config.ease ?? CustomEase.create("popIn", "M0,0 C0.046,0.091 0.35,0.895 0.5,1.1 0.789,0.822 0.72,0.895 1,1 "),
                stagger: config.stagger,
                duration: config.duration ?? 0.5,
            }, "<");
            return tl;
        }
    })

    const { contextSafe} = useGSAP(
        () => {
            register(flourishKey, () => {
                const root = scopeRef.current;

                const box = gsap.utils.toArray<HTMLElement>(".bounce-box", root);
                const floor = gsap.utils.toArray<HTMLElement>(".bounce-floor", root);
                const playhead = gsap.utils.toArray<HTMLElement>("#bounce-playhead", root);
                const timelineEl = gsap.utils.toArray<HTMLElement>("#bounce-timeline", root);
                const bounceTweens = gsap.utils.toArray<HTMLElement>(".bounce-tween", root);
                const handCursorWrapper = gsap.utils.toArray<HTMLElement>(".hand-cursor-wrapper", root);
                const handCursor = gsap.utils.toArray<HTMLElement>(".hand-cursor", root);
                const handGrabbing = gsap.utils.toArray<HTMLElement>(".hand-grabbing", root);
                if (!box || !floor || !playhead || !timelineEl || !bounceTweens || !handCursorWrapper || !handCursor || !handGrabbing) {
                    return null;
                }
                const animDuration = 4;
                const maxPlayheadX = 245;
                const boxDropY = window.matchMedia("(max-width: 639px)").matches ? 99 : 131;
                // setup:
                setupBounceTimelineFlourish();
                
                CustomBounce.create("bouncy", {
                    strength: 0.5,
                    endAtStart: false,
                    squash: 4,
                    squashID: "bouncy-squash"
                });
                let resumeTween: gsap.core.Tween | null = null;
                let boxTl: gsap.core.Timeline;

                const setCursorState = (isGrabbing: boolean) => {
                    gsap.set(handCursor, { autoAlpha: isGrabbing ? 0 : 1, display: isGrabbing ? "none" : "block" });
                    gsap.set(handGrabbing, { autoAlpha: isGrabbing ? 1 : 0, display: isGrabbing ? "block" : "none" });
                };

                const setScrubProgress = (value: number) => {
                    const progress = gsap.utils.clamp(0, 1, value);
                    // boxTl progress relies on the playhead position from 0...1
                    boxTl.totalProgress(progress);
                };
                const createSetupTimeline = contextSafe(() => {
                    const tl = gsap.timeline();

                    // bounce-scene
                    tl.fromTo(box, {
                        autoAlpha: 0,
                        y: 25
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 1,
                        ease: "power1.inOut"
                    })
                    .fromTo(floor, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power1.inOut" }, "<")
                    // playhead & timeline els
                    .fromTo(timelineEl, {
                        autoAlpha: 0,
                        y: 25,
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.75,
                        ease: "power1.inOut"
                    }, "<=0.25")
                    .fromTo(bounceTweens, { autoAlpha: 0, scale: 0.8, y: 10 }, {
                        autoAlpha: 1,
                        scale: 1,
                        y: 0,
                        stagger: 0.2,
                        ease: "power1.out",
                        duration: 0.5,
                    }, "<=0.25")
                    .to(playhead, { x: 0, duration: 0.5, ease: "power1.inOut" }, "<")
                    .add(gsap.effects.popIn(playhead, { duration: 0.6 }), "-=0.2")
                    .add(gsap.effects.popIn(handCursorWrapper, { scaleFrom: 0.6, duration: 0.4 }), "-=0.2");

                    return tl;
                });

                const createBoxTimeline = contextSafe(() => {
                    const tl = gsap.timeline({
                        paused: false,
                        onUpdate: () => {
                            // playhead also relies on boxTl progress, so they stay synced
                            gsap.set(playhead, { x: tl.progress() * maxPlayheadX });
                        }
                    });
                    const redStart = 0;
                    const redEnd = 0.3723 * animDuration;
                    const redDuration = redEnd - redStart;
                    const purpleStart = 0.1235 * animDuration;
                    const purpleEnd = 0.8800 * animDuration;
                    const purpleDuration = purpleEnd - purpleStart;
                    const yellowStart = 0.6132 * animDuration;
                    const yellowEnd = 1.0 * animDuration;
                    const yellowDuration = yellowEnd - yellowStart;

                    tl.addLabel("startRed", redStart);
                    tl.addLabel("endRed", redStart + redDuration);
                    tl.addLabel("startPurp", purpleStart);
                    tl.addLabel("endPurp", purpleEnd);
                    tl.addLabel("startYellow", yellowStart);
                    tl.addLabel("endYellow", yellowEnd);

                    const redTween = gsap.timeline({ defaults: { ease: "power1.inOut", duration: redDuration } });
                    const purpleTween = gsap.timeline({ defaults: { duration: purpleDuration } });
                    const yellowTween = gsap.timeline({ defaults: { ease: "power1.inOut", duration: yellowDuration } });

                    // redTween: changes gradient and turns square into circle
                    redTween.to(box, {
                        "--primary": "#4f39f6",
                        "--secondary": "#ff637e",
                    })
                    .to(box, {
                        borderRadius: "50%",
                        duration: 0.5,
                        ease: "none",
                    }, "<");

                    // purpleTween: starts the bounce and floor squash
                    purpleTween.to(box, {
                        y: boxDropY,
                        ease: "bouncy",
                    })
                    .to(box, {
                        scaleY: 0.6,
                        scaleX: 1.2,
                        ease: "bouncy-squash",
                        transformOrigin: "center bottom",
                    }, "<")
                    .to(floor, {
                        scaleX: 1.2,
                        ease: "bouncy-squash",
                        transformOrigin: "center center",
                        duration: purpleDuration,
                    }, "<");

                    // yellowTween: reverses the redTween back to the original gradient and shape
                    yellowTween.to(box, {
                        "--primary": "#65C466",
                        "--secondary": "#0d9488",
                    })
                    .to(box, {
                        borderRadius: "10px",
                        duration: 0.5,
                        ease: "none",
                    }, "<");

                    tl.add(redTween, "startRed");
                    tl.add(purpleTween, "startPurp");
                    tl.add(yellowTween, "startYellow");

                    return tl;
                });

                const createDraggablePlayhead = contextSafe(() => {
                    const instances = Draggable.create(playhead, {
                        type: "x",
                        bounds: { minX: 0, maxX: maxPlayheadX },
                        inertia: false,
                        edgeResistance: 1,
                        onPress: function() {
                            resumeTween?.kill();
                            resumeTween = null;
                            boxTl.pause();
                            setCursorState(false);
                        },
                        onDrag: function() {
                            setScrubProgress(this.x / maxPlayheadX);
                        },
                        onDragEnd: function() {
                            resumeTween?.kill();
                            resumeTween = boxTl.tweenTo(boxTl.duration(), {
                                ease: "none",
                                overwrite: true,
                            });
                        }
                    });

                    return instances[0];
                });

                const createMainTimeline = contextSafe((playheadDrag: Draggable) => {
                    const tl = gsap.timeline();

                    // cursor moves to the center of the timeline to grab the playhead
                    tl.to(handCursorWrapper, {
                        motionPath: {
                            path: [
                                { x: 0, y: 0 },
                                { x: 232, y: -105 }
                            ],
                            curviness: 0,
                            relative: true,
                        },
                        duration: animDuration / 2,
                        ease: "power1.inOut",
                    }, "<=0.1")
                    .call(() => {
                        // pause at halfway point before the fake scrub back to the start
                        resumeTween?.kill();
                        resumeTween = null;
                        boxTl.pause();
                        setScrubProgress(0.5);
                        playheadDrag.disable();
                        setCursorState(true);
                    })
                    .to({ progress: 0.5 }, {
                        progress: 0,
                        duration: 1,
                        delay: 0.2,
                        ease: "power1.inOut",
                        onUpdate: function() {
                            setScrubProgress((this.targets()[0] as { progress: number }).progress);
                        }
                    }, "<")
                    .to(handCursorWrapper, {
                        x: `-=${maxPlayheadX / 2}`,
                        duration: 1,
                        ease: "power1.inOut",
                    }, "<")
                    .call(() => {
                        gsap.delayedCall(0.2, () => {
                            setCursorState(false);
                            playheadDrag.enable();
                            resumeTween?.kill();
                            resumeTween = boxTl.tweenTo(boxTl.duration(), {
                                ease: "none",
                                overwrite: true,
                            });
                        });
                    })
                    .to(handCursorWrapper, {
                        motionPath: {
                            path: [
                                { x: -50, y: 25 },
                                { x: -15, y: 50 }
                            ],
                            relative: true,
                            curviness: 2,
                        },
                        duration: 2,
                        delay: 0.6,
                        ease: "power1.inOut",
                    })
                    .to(handCursorWrapper, {
                        autoAlpha: 0,
                        scale: 0.8,
                        duration: 0.5,
                        ease: "back.in(2)",
                    });

                    return tl;
                });

                const setupTl = createSetupTimeline();
                boxTl = createBoxTimeline();
                boxTlRef.current = boxTl;
                draggablePlayheadRef.current = createDraggablePlayhead();
                draggablePlayheadRef.current?.disable();
                const mainTl = createMainTimeline(draggablePlayheadRef.current);
                
                const tl = gsap.timeline();
                tl.addLabel("mainAnimation", setupTl.duration());
                tl.add(setupTl, 0);
                tl.add(mainTl, "mainAnimation+=0.5");
                tl.add(boxTl, "mainAnimation+=0.5");
                return tl;
            });

        }, {scope: scopeRef, dependencies: []}
    )

    const setupBounceTimelineFlourish = contextSafe(() => {

        const root = scopeRef.current;
        const box = gsap.utils.toArray<HTMLElement>(".bounce-box", root);
        const playhead = gsap.utils.toArray<HTMLElement>("#bounce-playhead", root);
        const bounceTweens = gsap.utils.toArray<HTMLElement>(".bounce-tween", root);
        const handCursorWrapper = gsap.utils.toArray<HTMLElement>(".hand-cursor-wrapper", root);
        const handCursor = gsap.utils.toArray<HTMLElement>(".hand-cursor", root);
        const handGrabbing = gsap.utils.toArray<HTMLElement>(".hand-grabbing", root);

        gsap.set(playhead, { autoAlpha: 0, x: 0 });
        gsap.set(bounceTweens, { autoAlpha: 0, scale: 0.8 });
        gsap.set(handCursorWrapper, { autoAlpha: 0 });
        gsap.set(handCursor, { autoAlpha: 1, display: "block" });
        gsap.set(handGrabbing, { autoAlpha: 0, display: "none" });
        gsap.set(box, { "--primary": "#65C466", "--secondary": "#0d9488" });

        // reset the playhead / play the boxTl
        boxTlRef.current?.seek(0).play();
        // disable draggable playhead
        draggablePlayheadRef.current?.disable();

    });

    return (
        <div className="flourish CD-flourish bounce-timeline-flourish absolute abs-x-center md2:left-auto md2:translate-x-0 md2:right-36 bottom-12 w-67.5 h-95  flex flex-col items-center justify-center gap-4" ref={scopeRef} id="bounce-timeline-flourish">
            <div className="bounce-scene w-25 h-50 flex flex-col items-center justify-between">
                {/* box */}
                <div className="bounce-box w-12.25 h-12.25 rounded-[10px] sm:mt-4 mt-12" style={{ background: "linear-gradient(to bottom, var(--primary), var(--secondary))" }} />
                {/* floor */}
                <div className="bounce-floor w-full h-1 bg-neutral-400 dark:bg-neutral-500 rounded-full" />
            </div>
            <div className="relative w-67.5 h-40">
                <Playhead color="#5A95E0" id="bounce-playhead" className="absolute left-0 top-0 z-10" dataCursor='hand'/>
                <Timeline id="bounce-timeline"/>
                <HandCursor className="absolute bottom-12 -left-24"/>
            </div>
        </div>
    )
}

const HandCursor = ({ className }: { className?:string }) => {
    const { resolvedTheme } = useTheme();
    const customCursorFill = resolvedTheme === "light"
        ? "oklch(0.92 0.01 255 / 0.25)"
        : "oklch(0.32 0.02 255 / 0.25)";
    return (
        <div className={`hand-cursor-wrapper z-50 ${className}`}>
            <CustomHand className={cn("hand-cursor w-7 h-7 abs-center", cursorThemeCn)} fill={customCursorFill}/>
            <CustomGrab className={cn("hand-grabbing w-7 h-7 abs-center hidden", cursorThemeCn)} fill={customCursorFill}/>
        </div>
    )

}

interface PlayheadProps {
    color?: string;
    id?: string;
    className?: string;
    dataCursor?: string;
}
const Playhead = ({ color="#51A2FF", id, className, dataCursor }: PlayheadProps ) => (
    <svg width="30" height="167" viewBox="0 0 30 167" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} id={id} data-cursor={dataCursor}>
        <path xmlns="http://www.w3.org/2000/svg" d="M17.3205 21C16.1658 23 13.279 23 12.1243 21L2.59804 4.49999C1.44334 2.49999 2.88672 -2.32178e-06 5.19612 -2.11989e-06L24.2487 -4.54262e-07C26.5581 -2.52367e-07 28.0015 2.5 26.8467 4.5L17.3205 21Z" fill={color}/>
        <g xmlns="http://www.w3.org/2000/svg" filter="url(#filter0_d_550_1485)">
            <line x1="14.5" y1="19.5" x2="14.5" y2="157.5" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        </g>
    </svg>
)

const Timeline = ({ id }: { id?: string } ) => (
    <div id={id} className="absolute bottom-0 w-full h-33.5 border-4 border-neutral-300 dark:border-neutral-700 bg-[#C0C0C0]/10 rounded-2xl p-2 flex flex-col items-start justify-center gap-2.5">
        <Tween className="bounce-tween bg-[#FF6467] dark:bg-[#E85C60]"/>
        <Tween className="bounce-tween w-47 ml-8 bg-[#7C86FF] dark:bg-[#6F79E8]"/>
        <Tween className="bounce-tween w-16 ml-38 bg-[#FFB900] dark:bg-[#D79A00]"/>
    </div>
)

const Tween = ({ className }: { color?: string, className?: string }) => (
    <div
        className={cn("w-24 h-8 border-3 border-neutral-400 dark:border-neutral-600 rounded-[10px]",  className)}
    />
)

export { BounceTimelineFlourish, GridFlourish, PenSquiggleFlourish, EditTextFlourish };