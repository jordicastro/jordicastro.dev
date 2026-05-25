"use client"

import { StoryThumbnailProps } from "@/types/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { useRef } from 'react';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RunningLogo } from "@/components/svgs/svgs";

const RunningThumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
  return (
    <div className="running-thumbnail relative w-full h-full flex-center pb-5">
        <RunningLogo />
    </div>
  )
}

export default RunningThumbnail