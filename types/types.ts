
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

export type DropdownOptions = {
    label: string;
    onClick: () => void;
}