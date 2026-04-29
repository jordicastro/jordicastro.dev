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
"[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/components/PhotoCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$usehooks$2d$ts$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Github/jordicastro.dev/node_modules/usehooks-ts/dist/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: !isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-[calc(100svh-16px)] w-full flex flex-col gap-card overflow-y-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-rows-2 grid-cols-2 h-full w-full gap-5 pt-4 pl-0 pr-0",
                children: gridItemIds.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroGridItem, {
                        id: id
                    }, id, false, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 17,
                        columnNumber: 29
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                lineNumber: 15,
                columnNumber: 21
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 14,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-auto w-full flex flex-col gap-card overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-full w-full flex flex-col items-center justify-start mt-subsection",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-center flex-col gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "flex text-center max-w-3/4",
                                        children: "Jordi Castro"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                        lineNumber: 28,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "flex items-center gap-3 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "️ 🌞"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                lineNumber: 32,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "/ˈdʒɔr.di ˈkæs.troʊ/"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                        lineNumber: 31,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                lineNumber: 27,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-center w-full h-auto gap-card mt-subsection items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-card mt-20 relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/hero/chilean-mountain2.png",
                                                alt: "chilean-mountain",
                                                width: 185,
                                                height: 246,
                                                className: "w-46 h-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                lineNumber: 41,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/hero/mangos2.png",
                                                alt: "arbol-de-mangos",
                                                width: 185,
                                                height: 246,
                                                className: "w-46 h-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                lineNumber: 42,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute hidden sm:flex flex-col items-end gap-card -top-10 -left-64 w-60",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: "/images/hero/playa-del-amor.png",
                                                        alt: "playa-del-amor",
                                                        width: 159,
                                                        height: 238,
                                                        className: "w-45 h-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                        lineNumber: 44,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: "/images/hero/chilean-fjords.png",
                                                        alt: "chilean-fjords",
                                                        width: 300,
                                                        height: 236,
                                                        className: "w-auto h-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                        lineNumber: 45,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                lineNumber: 43,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                        lineNumber: 40,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-card relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/hero/bucket-hat-jordi.png",
                                                alt: "bucket-hat-jordi",
                                                width: 185,
                                                height: 246,
                                                className: "w-46 h-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                lineNumber: 49,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/hero/iguaçu-waterfall.png",
                                                alt: "iguaçu-waterfall",
                                                width: 185,
                                                height: 246,
                                                className: "w-46 h-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                lineNumber: 50,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute hidden sm:flex flex-col items-start gap-card top-15 -right-53",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: "/images/hero/coatis.png",
                                                        alt: "coatis",
                                                        width: 186,
                                                        height: 249,
                                                        className: "w-46 h-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                        lineNumber: 52,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: "/images/hero/cactus-loscabos.png",
                                                        alt: "cactus-loscabos",
                                                        width: 200,
                                                        height: 249,
                                                        className: "w-49 h-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                        lineNumber: 53,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                                lineNumber: 51,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                        lineNumber: 48,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                lineNumber: 39,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 25,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 24,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-auto w-3/4 ml-10 flex-center mt-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroGridItem, {
                        id: "about"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 60,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 59,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 22,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false);
};
_s(Hero, "7khsyUHgctuHIPa2/KlDS6LcnT0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$usehooks$2d$ts$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"]
    ];
});
_c = Hero;
const HeroGridItem = ({ id })=>{
    const aboutPTags = [
        "I graduated from the University of Arkansas (May 2025) with a B.S. in Computer Science and a minor in Mathematics.",
        "I build full-stack applications, using modern frameworks and tools, including React, GSAP, Figma, and MongoDB. These projects range from mobile development to machine learning. ",
        // "I care about how products look and feel, which is why I gathered feedback from 50+ users before launching this website.",
        "Outside of coding, I enjoy running, hiking, and listening to music. I also love traveling and have visited 10 countries so far."
    ];
    if (id === "title") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "title-wrapper relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "absolute top-0 left-15",
                children: "introducing..."
            }, void 0, false, {
                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "abs-center flex flex-col gap-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "",
                        children: "Jordi Castro"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 82,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xl tracking-wider",
                                children: "️ 🌞🌋🥭"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                                lineNumber: 86,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            "/ˈdʒɔr.di ˈkæs.troʊ/"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 85,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                lineNumber: 81,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 77,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
    else if (id === "cards-right") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full w-full items-end gap-card overflow-x-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex shrink-0 justify-start items-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/hero/chilean-mountain2.png",
                        alt: "chilean-mountain",
                        width: 185,
                        height: 246,
                        className: "w-46 h-auto"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 99,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 98,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full shrink-0 self-stretch items-end justify-center pb-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/hero/bucket-hat-jordi.png",
                        alt: "bucket-hat-jordi",
                        width: 227,
                        height: 341,
                        className: "w-57 h-auto"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                        lineNumber: 102,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 101,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative hidden md:flex shrink-0 flex-col justify-end items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/hero/playa-del-amor-landscape.png",
                            alt: "playa-del-amor-landscape",
                            width: 257,
                            height: 192,
                            className: "w-70 h-auto"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                            lineNumber: 105,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/hero/cactus-loscabos.png",
                            alt: "cactus-loscabos",
                            width: 162,
                            height: 215,
                            className: "mt-4 w-40 h-auto"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                            lineNumber: 106,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 104,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 97,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 95,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
    else if (id === "cards-left") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "abs-center flex-center items-start w-full h-4/4 gap-card overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4 items-end justify-center shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/hero/mangos.png",
                            alt: "arbol-de-mangos",
                            width: 185,
                            height: 246,
                            className: "w-50 h-auto"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                            lineNumber: 115,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/hero/chilean-fjords.png",
                            alt: "chilean-fjords",
                            width: 200,
                            height: 236,
                            className: "w-64 h-auto"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                            lineNumber: 116,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 114,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$components$2f$PhotoCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: "/images/hero/iguaçu-waterfall.png",
                    alt: "iguaçu-waterfall",
                    width: 226,
                    height: 302,
                    className: "mt-10 w-55 h-auto"
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 118,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 113,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 112,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
    else if (id === "about") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-start",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-start justify-start h-full w-full xl:w-5/8 mt-section",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    children: "about"
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 125,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-ptag",
                    children: aboutPTags.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Github$2f$jordicastro$2e$dev$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: p
                        }, i, false, {
                            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                            lineNumber: 128,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
                    lineNumber: 126,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
            lineNumber: 124,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/Github/jordicastro.dev/app/(main)/_components/Hero.tsx",
        lineNumber: 123,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
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

//# sourceMappingURL=Documents_Github_jordicastro_dev_0al1jib._.js.map