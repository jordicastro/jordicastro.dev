import { cn } from '@/lib/utils';
import Image from 'next/image'

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}
const Logo = ({ width, height, className}: LogoProps) => {
  return (
    <Image
        src="/images/logos/JordPle.png"
        alt="logo"
        width={width ?? 64}
        height={height ?? 64}
        className={cn(
            "pointer-events-auto select-none",
            className
        )}
        draggable={false}
    />
  )
}

export default Logo