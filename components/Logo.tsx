import Image from 'next/image'
import React from 'react'

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}
const Logo = ({ width, height, className}: LogoProps) => {
  return (
    <Image
        src="/images/JordPle.png"
        alt="logo"
        width={width ?? 64}
        height={height ?? 64}
        className={`pointer-events-auto select-none` + ` ${className ?? ""}`}
        draggable={false}
    />
  )
}

export default Logo