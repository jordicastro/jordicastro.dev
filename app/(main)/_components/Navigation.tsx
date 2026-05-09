"use client";

import Logo from "@/components/Logo";
import { ChevronLeft, MenuIcon } from "lucide-react";
import SidebarSection from "./SidebarSection";
import { NavSectionData } from "@/types/types";
import { House, User, File, Moon, Sun, Layers, MousePointer2 as CursorIcon } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/svgs/svgs";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { scrollTo } from "@/lib/utils";
import ToggleThemeMorphSvg, { ToggleThemeMorphSvgHandle } from "./ToggleThemeMorphSvg";
import ToggleCursorMorphSvg, { ToggleCursorMorphSvgHandle } from "./ToggleCursorMorphSvg";
import { useResolvedSidebar, useSidebar } from "@/hooks/useSidebar";
import { useScrollMask } from "@/hooks/useScrollMask";
import { useScrollLock } from 'usehooks-ts';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Navigation = () => {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [hasMounted, setHasMounted] = useState(false);
    const isResizingRef = useRef(false);
    const sidebarSpacerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navbarRef = useRef<HTMLDivElement>(null);
    const themeToggleRef = useRef<ToggleThemeMorphSvgHandle>(null);
    const cursorToggleRef = useRef<ToggleCursorMorphSvgHandle>(null);

    const [isResetting, setIsResetting] = useState(false);
    const { isCollapsed, setIsCollapsed, hasHydrated } = useResolvedSidebar();
    const { isAnimating, duration } = useScrollMask();


    const className="w-4 h-4"
    const sectionsData: NavSectionData[] = [
        {
            title: "IMPORTANT",
            items: [
                {
                    icon: <House className={className}/>,
                    id: "home",
                    label: "Home",
                    onClick: () => handleUrlClick("home")
                },
                {
                    icon: <Layers className={className}/>,
                    id: "stories",
                    label: "Stories",
                    onClick: () => handleUrlClick("stories")
                },
                {
                    icon: <User className={className}/>,
                    id: "about",
                    label: "About",
                    onClick: () => handleUrlClick("about")
                }
            ]
        },
        {
            title: "CONTACT",
            items: [
                {
                    icon: <LinkedInIcon className={className}  />,
                    label: "LinkedIn",
                    onClick: () => window.open("https://www.linkedin.com/in/jordicastr0/", "_blank")
                },
                {
                    icon: <GitHubIcon className={className}/>,
                    label: "GitHub",
                    onClick: () => window.open("https://www.github.com/jordicastro", "_blank")
                },
                {
                    icon: <File className={className}/>,
                    label: "Resume",
                    onClick: () => window.open("/documents/Jordi_Castro_Resume.pdf", "_blank")
                }
            ]
        },
        {
            title: "SETTINGS",
            items: [
                {
                    icon: <ToggleThemeMorphSvg ref={themeToggleRef} />,
                    label: "Theme",
                    onClick: () => toggleTheme()
                },
                {
                    icon: <ToggleCursorMorphSvg ref={cursorToggleRef} />,
                    label: "Cursor",
                    onClick: () => toggleCursor()
                }
            ]
        }
    ]
    
    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    useEffect(() => { // used to lock the main content scroll underneath the fully expanded mobile nav
        if (!isCollapsed && isMobile) {
            document.body.style.overflow = "hidden";
        } else if (isCollapsed && isMobile) {
            document.body.style.overflow = "auto";
        }
    }, [isCollapsed, isMobile]);

    useGSAP(() => { // used to fade the collapsed menu icon in and out during scroll mask animation
        if (!isAnimating) return;
        const collapsedMenuIcon = document.getElementById("collapsed-menu-icon");
        if (!collapsedMenuIcon) return;

        if (isAnimating) {
            // hide the collapsed icon
            const tl = gsap.timeline();
            const revealDelay = duration == 1 ? (duration + 0.6) : (duration + 0.5);

            tl
                .to(collapsedMenuIcon, { autoAlpha: 0, duration: 0.3, ease: "power1.inOut", delay: 0.3 })
                .to(collapsedMenuIcon, { autoAlpha: 1, duration: 0.3, ease: "power1.inOut" }, `<=${revealDelay}`)
        }
    }, [isAnimating]);


    const isMobileViewport = hasMounted && isMobile;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizingRef.current || !sidebarRef.current || !navbarRef.current) return;

        let newWidth = e.clientX;
        const collapseThreshold = isMobileViewport ? window.innerWidth * 0.8 : 200; // mobile swipe 80% of screen collapses nav
        const minWidth = 240; // some padding between 240px so it doesnt automatically collapse
        const maxWidth = isMobileViewport ? window.innerWidth : 240;

        if (newWidth < collapseThreshold) {
            setTimeout(() => {
                if (isResizingRef.current) {
                    handleMouseUp();
                    collapse();
                }
            }, 0);
            return;
        }

        // limit how far the user can resize the sidebar
        if (newWidth < minWidth) newWidth = minWidth;
        if (newWidth > maxWidth) newWidth = maxWidth;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            if (!isMobileViewport && sidebarSpacerRef.current) {
                sidebarSpacerRef.current.style.width = `${newWidth}px`;
            }
            navbarRef.current.style.left = `${newWidth}px`;
            navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    const resetWidth = () => {
        if (!sidebarRef.current || !navbarRef.current) return;
        setIsCollapsed(false);
        setIsResetting(true);

        sidebarRef.current.style.width = isMobileViewport ? "100vw" : "240px";
        if (sidebarSpacerRef.current) {
            sidebarSpacerRef.current.style.width = isMobileViewport ? "0" : "240px";
        }
        navbarRef.current.style.width = isMobileViewport ? "0" : "calc(100% - 240px)";
        navbarRef.current.style.left = isMobileViewport ? "100%" : "240px";
        setTimeout(() => setIsResetting(false), 300);
    }
    
    const collapse = () => {
        if (!sidebarRef.current || !navbarRef.current) return;
        setIsCollapsed(true);
        setIsResetting(true);

        sidebarRef.current.style.width = "0";
        if (sidebarSpacerRef.current) {
            sidebarSpacerRef.current.style.width = "0";
        }
        navbarRef.current.style.width = "100%";
        navbarRef.current.style.left = "0";
        setTimeout(() => setIsResetting(false), 300);
    }

    const handleUrlClick = (id: string) => {
        if (pathname === "/") {
            handleScrollTo(id);
        } else { // if the user clicks the home icon from a different page, just go to '/'
            if (id === "home") {
                window.location.href = "/";
            }
            else {
                window.location.href = `/#${id}`;
                handleScrollTo(id);
            }
        }
    }

    const handleScrollTo = (id: string) => {
        // util method that scrolls with gsap
        scrollTo(id);
        if (isMobileViewport) collapse();   
    }

    const toggleTheme = () => {
        themeToggleRef.current?.toggleMorphTheme();
    };

    const toggleCursor = () => {
        cursorToggleRef.current?.toggleMorphCursor();
    };

    return hasHydrated ? (
        <>
            <div
                ref={sidebarSpacerRef}
                aria-hidden="true"
                className={cn(
                    "hidden md:block shrink-0",
                    isResetting && "transition-all ease-in-out duration-300",
                    isCollapsed ? "w-0" : "w-60"
                )}
            />
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar fixed inset-y-0 left-0 h-svh bg-bg-secondary flex w-60 flex-col z-40",
                    isResetting && "transition-all ease-in-out duration-300",
                    isCollapsed ? "overflow-hidden" : "overflow-visible",
                    isCollapsed && "w-0 px-0",
                    isMobileViewport && !isCollapsed && "z-50 w-screen max-w-none",
                    isMobileViewport && isCollapsed && "w-0 px-0"
                )}
            >
                <div className="h-full overflow-x-hidden overflow-y-auto px-3">
                    {/* sidebar header */}
                    <div className="w-full h-15 flex-between mt-3">
                        <Logo width={40} height={40}/>
                        <div className={cn(
                                "flex-center w-8 h-8 rounded-md bg-none hoverable",
                                isMobileViewport && "opacity-100",
                                !isMobileViewport && "hover:bg-bg-tertiary"
                            )}
                            role="button"
                            onClick={collapse}
                            data-cursor='pointer'
                        >
                            <ChevronLeft className="w-6 h-6"/>
                        </div>
                    </div>
                    {/* sidebar sections */}
                    {sectionsData.map((section, i) => (
                        <SidebarSection
                            key={i}
                            title={section.title}
                            items={section.items}
                        />
                    ))}
                </div>
                {/* default right border */}
                <div
                    className={cn(
                        "absolute h-full w-0.5 group-hover/sidebar:w-0.75 bg-bg-tertiary right-0 top-0 transition-all",
                        isCollapsed && "hidden"
                    )}
                />
                {/* hover draggable bar */}
                <div
                    className={cn(
                        "opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute top-0 right-0 h-full w-2.75 translate-x-1",
                        isCollapsed && "hidden"
                    )}
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    data-cursor='hand'
                />
            </aside>
                {/* collapsed icon */}
                <div
                    ref={navbarRef}
                    className={cn(
                        "fixed top-0 z-50",
                        isResetting && "transition-all ease-in-out duration-300",
                        isCollapsed ? "left-0 w-full" : "left-60 w-[calc(100%-240px)]",
                        isMobileViewport && !isCollapsed && "left-0 w-full"
                    )}
                >
                    <nav className="bg-transparent px-3 py-6 w-full">
                        {isCollapsed && 
                            <MenuIcon
                                role="button"
                                onClick={resetWidth}
                                className="h-6 w-6 text-neutral-600 dark:text-neutral-300 hoverable"
                                data-cursor='pointer'
                                id="collapsed-menu-icon"
                            />
                        }
                    </nav>
                </div>
        </>
    ) : null;
}

export default Navigation