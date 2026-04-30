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



const Navigation = () => {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [hasMounted, setHasMounted] = useState(false);

    const [activeItem, setActiveItem] = useState<string>("Home");
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navbarRef = useRef<HTMLDivElement>(null);

    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    useEffect(() => {
        setHasMounted(true);
    }, []);

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
        navbarRef.current.style.width = isMobileViewport ? "0" : "calc(100% - 240px)";
        navbarRef.current.style.left = isMobileViewport ? "100%" : "240px";
        setTimeout(() => setIsResetting(false), 300);
    }
    
    const collapse = () => {
        if (!sidebarRef.current || !navbarRef.current) return;
        setIsCollapsed(true);
        setIsResetting(true);

        sidebarRef.current.style.width = "0";
        navbarRef.current.style.width = "100%";
        navbarRef.current.style.left = "0";
        setTimeout(() => setIsResetting(false), 300);
    }
        

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full shrink-0 bg-bg-secondary overflow-x-hidden overflow-y-auto relative flex w-60 flex-col z-10 px-3",
                    isResetting && "transition-all ease-in-out duration-300",
                    isCollapsed && "w-0 px-0",
                    isMobileViewport && !isCollapsed && "fixed inset-y-0 left-0 z-50 h-svh w-screen max-w-none",
                    isMobileViewport && isCollapsed && "w-0 px-0"
                )}
            >
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
                        activeItem={activeItem}
                    />
                ))}
                {/* hover draggable bar */}
                <div
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-bg-tertiary right-0 top-0"
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                />
                {/* default right border */}
                <div className="absolute h-full w-0.5 bg-bg-tertiary right-0 top-0" />
            </aside>
                {/* collapsed icon */}
                <div
                    ref={navbarRef}
                    className={cn(
                        "absolute top-0 z-50",
                        isResetting && "transition-all ease-in-out duration-300",
                        isCollapsed ? "left-0 w-full" : "left-60 w-[calc(100%-240px)]",
                        isMobileViewport && !isCollapsed && "left-0 w-full"
                    )}
                >
                    <nav className="bg-transparent px-3 py-6 w-full">
                        {isCollapsed && 
                            <MenuIcon role="button" onClick={resetWidth} className="h-6 w-6 text-neutral-600 dark:text-neutral-300 hoverable" />
                        }
                    </nav>
                </div>
        </>
    )
}
const className="w-4 h-4"
export const sectionsData: NavSectionData[] = [
    {
        title: "IMPORTANT",
        items: [
            {
                icon: <House className={className}/>,
                label: "Home",
                href: "/"
            },
            {
                icon: <Layers className={className}/>,
                label: "Stories",
                href: "/#stories"
            },
            {
                icon: <User className={className}/>,
                label: "About",
                href: "/"
            }
        ]
    },
    {
        title: "CONTACT",
        items: [
            {
                icon: <LinkedInIcon className={className}  />,
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/jordicastr0/"
            },
            {
                icon: <GitHubIcon className={className}/>,
                label: "GitHub",
                href: "https://www.github.com/jordicastro"
            },
            {
                icon: <File className={className}/>,
                label: "Resume",
                href: "/documents/Jordi_Castro_Resume.pdf"
            }
        ]
    },
    {
        title: "SETTINGS",
        items: [
            {
                icon: <Moon className={className}/>,
                label: "Theme",
                onClick: () => {}
            },
            {
                icon: <CursorIcon className={className}/>,
                label: "Cursor",
                onClick: () => {}
            }
        ]
    }
]

export default Navigation