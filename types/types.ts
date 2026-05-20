import { LucideIcon } from "lucide-react";

export type NavSectionItem = {
    icon: React.ReactNode;
    id?: string;
    label: string;
    onClick?: () => void;
}

export type NavSectionData = {
    title: string;
    items: NavSectionItem[];
}

export type FlourishBuilder = () => gsap.core.Tween | gsap.core.Timeline | null;

export type FlourishKey = SEFlourishKey | CDFlourishKey;
export type SEFlourishKey = "git" | "sql" | "reactBtn" | "tag";
export type CDFlourishKey = "bounce" | "grid" | "penSquiggle" | "editText";

export interface FlourishRegisterProps {
    flourishKey: FlourishKey;
    register: (key: FlourishKey, build: FlourishBuilder) => void;
    iteration?: number;
}

export type Section = {
    id: string;
    label: string;
    activeColor?: string;
}

export type timelineCardDataType = {
    title: string;
    subtitle?: string;
    company: string;
    year: string;
}

export type directionType = "up" | "down" | null;

export type FilterOption = "projects" | "industry" | "research";
export type SortOption = "Newest" | "Oldest" | "A-Z";

export type DropdownOption = {
    id: FilterOption | SortOption;
    label: string;
    onClick: () => void;
}

export type CursorVariant = "default" | "pointer" | "hand" | "grab" | "notAllowed";

export type ShapeType = "landscape" | "portrait";

export type storyCard = {
    id: string;
    slug?: string;
    title: string;
    icon?: React.ReactNode;
    subtitle?: string;
    description?: string; // onHover: the desc overlay expands to show this text (maybe)
    year: string;
    thumbnail: React.ComponentType<StoryThumbnailProps>;
    type: FilterOption;
    notAllowed?: boolean; // hover: "coming soon" stripe overlay
    shape: ShapeType;
    className?: string;
    isHidden?: boolean;
    onHover?: () => void;
    onHoverEnd?: () => void;
}

export type StoryThumbnailProps = {
    isHovered?: boolean;
}