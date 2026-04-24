import React from 'react'

type IconProps = {
    color?: string;
    className?: string;
}

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


export { LinkedInIcon, GitHubIcon }