import { ToggleTheme } from '@/components/ToggleTheme'
import React from 'react'
import ShakespeareThumbnail from './storythumbnails/ShakespeareThumbnail'

const TagStyles = () => {
    return (
        <div className="h-svh w-full flex flex-col gap-4">
            <h1 className="">
            h1: Jordi Castro
            </h1>
            <h2 className="text-gradient-b dark:text-gradient-p">
            h2: In December 2025, Jordi
            <br />
            completed a marathon in
            </h2>
            <h3>
            h3: Timeline
            </h3>
            <h4>
            h4: SUB SECTION HEADING
            </h4>
            <p>
            p: this is a paragraph text example. lorem ipsum dolor sit amet, consectetur 
            <br />
            voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
            </p>
            <ToggleTheme className=""/>
            <ShakespeareThumbnail shouldPlayThumbnail={true} />
        </div>
    )
}

export default TagStyles