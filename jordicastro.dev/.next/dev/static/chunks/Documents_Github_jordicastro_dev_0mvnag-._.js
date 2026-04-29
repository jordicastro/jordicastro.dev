(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/Github/jordicastro.dev/components/PhotoCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const PhotoCard = ({ src, alt, width, height, className })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        src: src,
        alt: alt,
        width: width,
        height: height,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('object-cover rounded-lg', className)
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/components/PhotoCard.tsx",
        lineNumber: 14,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = PhotoCard;
const __TURBOPACK__default__export__ = PhotoCard;
var _c;
__turbopack_context__.k.register(_c, "PhotoCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Github/jordicastro.dev/hooks/useSidebar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSidebar",
    ()=>useSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        isCollapsed: true,
        width: 0,
        setIsCollapsed: (value)=>set({
                isCollapsed: value
            }),
        setWidth: (value)=>set({
                width: value
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/components/PhotoCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$hooks$2f$useSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/hooks/useSidebar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$usehooks$2d$ts$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/usehooks-ts/dist/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const Hero = ()=>{
    _s();
    const gridItemIds = [
        "title",
        "cards-right",
        "cards-left",
        "about"
    ];
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$usehooks$2d$ts$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"])("(max-width: 992px)"); // usually 768, but need to start mobile breakpoint earlier
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-[calc(100svh-16px)] w-full flex flex-col gap-4 border-debug overflow-y-hidden",
        children: isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "ismobile"
        }, void 0, false, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 14,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-rows-2 grid-cols-2 h-full w-full gap-6 pt-4 pl-0 pr-0",
            children: gridItemIds.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroGridItem, {
                    id: id
                }, id, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 20,
                    columnNumber: 25
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 18,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Hero, "7khsyUHgctuHIPa2/KlDS6LcnT0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$usehooks$2d$ts$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"]
    ];
});
_c = Hero;
const HeroGridItem = ({ id })=>{
    _s1();
    const isSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$hooks$2f$useSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"])({
        "HeroGridItem.useSidebar[isSidebarCollapsed]": (state)=>state.isCollapsed
    }["HeroGridItem.useSidebar[isSidebarCollapsed]"]);
    const sidebarWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$hooks$2f$useSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"])({
        "HeroGridItem.useSidebar[sidebarWidth]": (state)=>state.width
    }["HeroGridItem.useSidebar[sidebarWidth]"]);
    const aboutPTags = [
        "I graduated from the University of Arkansas (May 2025) with a B.S. in Computer Science and a minor in Mathematics.",
        "I build full-stack applications, using modern frameworks and tools, including React, GSAP, Figma, and MongoDB. These projects range from mobile development to machine learning. ",
        "I care about how products look and feel, which is why I gathered feedback from 50+ users before launching this website.",
        "Outside of coding, I enjoy running, hiking, and listening to music. I also love traveling and have visited 10 countries so far."
    ];
    const titleFontSize = isSidebarCollapsed ? undefined : `${8 - Math.min(sidebarWidth, 240) * 0.004}rem`;
    if (id === "title") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "title-wrapper relative border-debug-p overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "absolute top-0 left-0",
                children: "introducing..."
            }, void 0, false, {
                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "abs-x-center bottom-0 flex flex-col gap-6 w-full text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "border-debug-p overflow-hidden text-ellipsis transition-[font-size] duration-300 ease-in-out",
                        style: titleFontSize ? {
                            fontSize: titleFontSize
                        } : undefined,
                        children: "Jordi Castro"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 48,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xl",
                                children: "️ 🌞🌋🥭"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                lineNumber: 52,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            "/ˈdʒɔr.di ˈkæs.troʊ/"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 51,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                lineNumber: 47,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 43,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
    else if (id === "cards-right") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-debug-p",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full w-full items-end gap-4 overflow-x-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex shrink-0 justify-start items-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/hero/chilean-mountain.png",
                        alt: "chilean-mountain",
                        width: 185,
                        height: 246,
                        className: ""
                    }, void 0, false, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 65,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 64,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full shrink-0 self-stretch items-start justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/hero/bucket-hat-jordi.png",
                        alt: "bucket-hat-jordi",
                        width: 227,
                        height: 341,
                        className: ""
                    }, void 0, false, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 68,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 67,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden lg:flex shrink-0 flex-col justify-end items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/hero/playa-del-amor-landscape.png",
                            alt: "playa-del-amor-landscape",
                            width: 257,
                            height: 192,
                            className: ""
                        }, void 0, false, {
                            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                            lineNumber: 71,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/hero/jordo-spiderman.png",
                            alt: "jordo-spiderman",
                            width: 162,
                            height: 215,
                            className: "mt-4"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                            lineNumber: 72,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 70,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 63,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 61,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
    else if (id === "cards-left") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-debug-p relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "abs-center flex-center items-start w-full h-4/4 gap-4 overflow-x-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: "/images/hero/mangos.png",
                    alt: "arbol-de-mangos",
                    width: 185,
                    height: 246,
                    className: ""
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 80,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: "/images/hero/iguaçu-brasil.png",
                    alt: "iguaçu-brasil",
                    width: 226,
                    height: 302,
                    className: "mt-4"
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 81,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 79,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 78,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
    else if (id === "about") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-debug-p flex-start",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-start justify-start h-full w-full xl:w-5/8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    children: "about"
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 88,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4",
                    children: aboutPTags.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: p
                        }, i, false, {
                            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                            lineNumber: 91,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 89,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 87,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 86,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(HeroGridItem, "eBTIk0uz19LcNIclHONrReg6f44=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$hooks$2f$useSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$hooks$2f$useSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"]
    ];
});
_c1 = HeroGridItem;
const __TURBOPACK__default__export__ = Hero;
var _c, _c1;
__turbopack_context__.k.register(_c, "Hero");
__turbopack_context__.k.register(_c1, "HeroGridItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Github/jordicastro.dev/app/(main)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$app$2f28$main$292f$_components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function Home() {
    _s();
    const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
            const authenticatedAt = localStorage.getItem("authenticatedAt");
            // If the user was authenticated more than 24 hours ago, log them out
            const now = new Date().getTime();
            if (authenticatedAt && now - parseInt(authenticatedAt) > TWENTY_FOUR_HOURS_IN_MS) {
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("authenticatedAt");
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            } else if (storedIsAuthenticated && storedIsAuthenticated) {
                setIsAuthenticated(storedIsAuthenticated === "true");
                setIsLoading(false);
            } else {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        }
    }["Home.useEffect"], [
        setIsAuthenticated,
        setIsLoading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!isLoading && !isAuthenticated) {
                router.replace("/maintenance");
            }
        }
    }["Home.useEffect"], [
        isAuthenticated,
        isLoading,
        router
    ]);
    if (isLoading || !isAuthenticated) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$app$2f28$main$292f$_components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/page.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/page.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(Home, "VCqNhcE/3tGZ2+5n1yyLZmtfihY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_Github_jordicastro_dev_0mvnag-._.js.map