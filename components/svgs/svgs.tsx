import { cn } from '@/lib/utils';

type IconProps = {
    color?: string;
    className?: string;
}

// sidebar nav icons
const LinkedInIcon = ({ color = 'currentColor', className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" className={className}>
    <path d="M11.2501 5.24994C12.4436 5.24994 13.5882 5.72405 14.4321 6.56798C15.276 7.41191 15.7501 8.55652 15.7501 9.75001V15.0001H12.7501V9.75001C12.7501 9.35218 12.5921 8.97064 12.3107 8.68933C12.0294 8.40802 11.6479 8.24999 11.2501 8.24999C10.8522 8.24999 10.4707 8.40802 10.1894 8.68933C9.90809 8.97064 9.75005 9.35218 9.75005 9.75001V15.0001H6.75V9.75001C6.75 8.55652 7.22411 7.41191 8.06804 6.56798C8.91197 5.72405 10.0566 5.24994 11.2501 5.24994Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.75005 6.00006H0.75V15.0002H3.75005V6.00006Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.25002 3.75005C3.07846 3.75005 3.75005 3.07846 3.75005 2.25002C3.75005 1.42158 3.07846 0.75 2.25002 0.75C1.42158 0.75 0.75 1.42158 0.75 2.25002C0.75 3.07846 1.42158 3.75005 2.25002 3.75005Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const GitHubIcon = ({ color = 'currentColor', className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none" className={className}>
    <path d="M9.85015 14.75V11.95C9.94753 11.0731 9.6961 10.1931 9.15015 9.5C11.2501 9.5 13.3501 8.1 13.3501 5.65C13.4061 4.775 13.1611 3.914 12.6501 3.2C12.8461 2.395 12.8461 1.555 12.6501 0.75C12.6501 0.75 11.9501 0.75 10.5501 1.8C8.70215 1.45 6.79815 1.45 4.95015 1.8C3.55015 0.75 2.85015 0.75 2.85015 0.75C2.64015 1.555 2.64015 2.395 2.85015 3.2C2.34046 3.91112 2.09308 4.77695 2.15015 5.65C2.15015 8.1 4.25015 9.5 6.35015 9.5C6.07715 9.843 5.87415 10.235 5.75515 10.655C5.63615 11.075 5.60115 11.516 5.65015 11.95V14.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.65 11.9501C2.493 13.3501 2.15 10.5501 0.75 10.5501" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

// editText flourish: typography popover icons
const DragIcon = ({ color }: {color?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16" fill="none">
    <path d="M1 1H17.6667" stroke={color ?? "#a1a1a1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 7.6665H17.6667" stroke={color ?? "#a1a1a1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 14.3335H17.6667" stroke={color ?? "#a1a1a1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const BoldIcon = ({ color }: {color?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" className="z-99">
    <path d="M0.75 7.41666H9.98076C11.0688 7.41666 12.1123 7.76785 12.8817 8.39297C13.6511 9.01809 14.0833 9.86594 14.0833 10.75C14.0833 11.634 13.6511 12.4819 12.8817 13.107C12.1123 13.7321 11.0688 14.0833 9.98076 14.0833H1.77564C1.50362 14.0833 1.24275 13.9955 1.0504 13.8392C0.858058 13.683 0.75 13.471 0.75 13.25V1.58333C0.75 1.36232 0.858058 1.15036 1.0504 0.994078C1.24275 0.837797 1.50362 0.75 1.77564 0.75H8.95512C10.0432 0.75 11.0867 1.10119 11.8561 1.72631C12.6255 2.35143 13.0577 3.19928 13.0577 4.08333C13.0577 4.96739 12.6255 5.81523 11.8561 6.44035C11.0867 7.06547 10.0432 7.41666 8.95512 7.41666" stroke={color ?? "#A1A1A1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const ItalicIcon = ({ color }: {color?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M14.0833 0.75H5.75" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.08333 14.0835H0.75" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.7502 0.75L4.0835 14.0833" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const UnderlineIcon = ({ color }: {color?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2.4165 0.75V5.75C2.4165 7.07608 2.94329 8.34785 3.88097 9.28553C4.81865 10.2232 6.09042 10.75 7.4165 10.75C8.74258 10.75 10.0144 10.2232 10.952 9.28553C11.8897 8.34785 12.4165 7.07608 12.4165 5.75V0.75" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.75 14.083H14.0833" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const TextSizeIcon = ({ color }: {color?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="15" viewBox="0 0 24 15" fill="none">
    <path d="M15.6279 0.75V14.0833" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.96094 3.25V1.58333C8.96094 1.36232 9.04873 1.15036 9.20502 0.994078C9.3613 0.837797 9.57326 0.75 9.79427 0.75H21.4609C21.6819 0.75 21.8939 0.837797 22.0502 0.994078C22.2065 1.15036 22.2943 1.36232 22.2943 1.58333V3.25" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.1274 14.084H18.1274" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.96094 7.4165V14.0834" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.75 7.53855C0.828143 7.4604 0.934128 7.4165 1.04464 7.4165H6.87821C6.98872 7.4165 7.0947 7.4604 7.17285 7.53855" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.71094 14.084H5.21104" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const UpIcon = ({ color }: {color?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="4" viewBox="0 0 9 4" fill="none">
    <path d="M7.41699 2.4165L4.08366 0.749838L0.750329 2.4165" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const DownIcon = ({ color }: {color?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="4" viewBox="0 0 9 4" fill="none">
    <path d="M0.75 0.75L4.08333 2.41667L7.41666 0.75" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const FontIcon = ({ color }: {color?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="12" viewBox="0 0 23 12" fill="none">
    <path d="M14.292 5.95833H18.9795C19.6702 5.95833 20.3325 6.2327 20.8209 6.72107C21.3093 7.20945 21.5837 7.87183 21.5837 8.5625C21.5837 9.25316 21.3093 9.91554 20.8209 10.4039C20.3325 10.8923 19.6702 11.1667 18.9795 11.1667H14.8128C14.6747 11.1667 14.5422 11.1118 14.4445 11.0141C14.3469 10.9164 14.292 10.784 14.292 10.6458V1.27083C14.292 1.1327 14.3469 1.00022 14.4445 0.902549C14.5422 0.804873 14.6747 0.75 14.8128 0.75H17.9378C18.6285 0.75 19.2909 1.02437 19.7792 1.51274C20.2676 2.00112 20.542 2.6635 20.542 3.35417C20.542 4.04483 20.2676 4.70721 19.7792 5.19559C19.2909 5.68396 18.6285 5.95833 17.9378 5.95833" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.75 11.1666L4.95729 1.07286C4.99685 0.977966 5.06361 0.896905 5.14916 0.839886C5.2347 0.782867 5.33521 0.752441 5.43802 0.752441C5.54083 0.752441 5.64133 0.782867 5.72688 0.839886C5.81243 0.896905 5.87919 0.977966 5.91875 1.07286L10.125 11.1666" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.1084 8.0415H8.76673" stroke={color ?? "#a1a1a1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

// squiggle flourish
const BlueSquiggle = ({ color }: {color?: string}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 160"
        width="100%"
        height="100%"
        fill="none"
        overflow="visible"
        className="blue-squiggle"
    >
        <path
            className="blue-squiggle-path"
            d="M 6 106 C 59 75 108 -5 166 6 C 227 17 223 138 274 154 C 325 170 354 110 394 80"
            stroke={color ?? "#2B7FFF"}
            strokeWidth="25"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
)

// custom cursor icons
interface CustomMouseProps {
    className?: string;
    fill?: string | undefined;
}

const CustomMouse = ({ fill, className }: CustomMouseProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill ?? "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={cn("custom-mouse", className)}
        >
            <path
                d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
                fill={fill ?? "none"}
            />
        </svg>
    )
}
const CustomPointer = ({ fill, className }: CustomMouseProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill ?? "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={cn("custom-pointer", className)}
        >
            <path d="M22 14a8 8 0 0 1-8 8"/>
            <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
            <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/>
            <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/>
            <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
        </svg>
    )
}
const CustomHand = ({ fill, className }: CustomMouseProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill ?? "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={cn("custom-hand", className)}
        >
            <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
            <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
        </svg>
    )
}
const CustomGrab = ({ fill, className }: CustomMouseProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill ?? "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={cn("custom-grab", className)}
        >
            <path d="M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4"/>
            <path d="M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
            <path d="M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5"/>
            <path d="M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
            <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"/>
        </svg>
    )
}

export { LinkedInIcon, GitHubIcon, DragIcon, BoldIcon, ItalicIcon, UnderlineIcon, TextSizeIcon, UpIcon, DownIcon, FontIcon, BlueSquiggle, CustomMouse, CustomPointer, CustomHand, CustomGrab }
