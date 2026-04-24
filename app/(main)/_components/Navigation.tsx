"use client";

import Logo from "@/components/Logo";
import { ChevronLeft } from "lucide-react";
import SidebarSection from "./SidebarSection";
import { NavSectionData } from "@/types/types";
import { House, User, File, Moon, Sun, Layers, MousePointer2 as CursorIcon } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/svgs/svgs";
import { useState } from "react";



const Navigation = () => {
    const [activeItem, setActiveItem] = useState<string>("Home");

    return (
        <>
            <aside
                className="group/sidebar h-full bg-bg-secondary overflow-y-auto relative flex w-60 flex-col z-10 px-3"
            >
                {/* sidebar header */}
                <div className="w-full h-15 flex-between mt-3">
                    <Logo width={40} height={40}/>
                    <div className="flex-center w-8 h-8 rounded-md bg-none hover:bg-bg-tertiary hover:cursor-pointer transition">
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
                <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-bg-tertiary right-0 top-0" />
                {/* default right border */}
                <div className="absolute h-full w-0.5 bg-bg-tertiary right-0 top-0" />
            </aside>
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