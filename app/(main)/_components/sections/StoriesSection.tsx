"use client"

import DropdownButton from '@/components/DropdownButton'
import { useStoriesDropdownOptions } from '@/hooks/useStoriesDropdownOptions'
import { ArrowDownUp, ListFilter } from 'lucide-react'
import React from 'react'

const StoriesSection = ({ id }: { id?: string }) => {
    return (
        <div id={id} className="w-full min-h-screen flex flex-col gap-15 border-debug-p pt-20 px-10">
            <StoriesHeader />
            {/* <Stories /> */}

        </div>
    )
}

const StoriesHeader = () => {
    const { filterOptions, sortOptions } = useStoriesDropdownOptions();

    return (
        <div className="w-full h-auto flex items-center justify-between">
            <h4 className="mb-0">STORIES</h4>
            <div className="w-auto h-auto flex items-center justify-end gap-11">
                <DropdownButton label="Filter" icon={ListFilter} options={filterOptions} checkBoxes />
                <DropdownButton label="Sort" icon={ArrowDownUp} options={sortOptions} />
            </div>
        </div>
    )
}

export default StoriesSection