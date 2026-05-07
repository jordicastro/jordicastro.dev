
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