"use client"

import ReactionPill from "@/app/(main)/_components/ReactionPill";

const SupplyPikeStory = () => {
  const storyId = 'supplypike'
  return (
    <div className="min-h-screen w-full flex-center flex-col">
        <h4>
            SupplyPike story
        </h4>
        <ReactionPill storyId={storyId} />
    </div>
  )
}

export default SupplyPikeStory