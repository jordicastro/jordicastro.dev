
export type NavSectionItem = {
    icon: React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
}

export type NavSectionData = {
    title: string;
    items: NavSectionItem[];
}