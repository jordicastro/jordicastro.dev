import IconButton from '@/components/IconButton';
import { ThumbsUp } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import MarathonRollingTime from './MarathonRollingTime';

const CalloutMarathon = () => {
    const sm = useMediaQuery("(max-width: 640px)");
    const md = useMediaQuery("(max-width: 768px) and (min-width: 641px)");
    const mdBreakpoint = useMediaQuery("(max-width: 910px) and (min-width: 769px)");
    const rollingTimeCN = mdBreakpoint ? 
        "absolute left-0 top-40" : md ? // wrap to next line (underneath h2)
        "absolute left-0 top-35" : sm ?// medium text
        "absolute left-0 top-25 text-lg" : // small text
        "absolute -right-35 top-20 text-9xl"; // default: to the right of the h2
    
    const textSize = md ? "text-6xl" : sm ? "text-5xl" : "text-7xl";
    const widthHeight = md ? "w-27 h-12" : sm ? "w-22 h-10" : "w-35 h-15";


    const goTo = (url: string): void => {
        window.open(url, "_blank");
    };

    return (
        <div className="mt-section w-full h-[50svh] flex-center">
            <div className="w-280 h-88 mt-section">
                <div className={cn(
                    'relative h-full max-w-185 flex flex-col items-start',
                    mdBreakpoint ? "gap-32" : md ? "gap-28" : sm ? "gap-24" : "gap-16"
                )}>
                    <h2 className="line-clamp-2">
                        In December 2025, Jordi completed a marathon in
                    </h2>
                    <MarathonRollingTime className={rollingTimeCN} textSize={textSize} widthHeight={widthHeight}/>
                    <IconButton className="" text="give kudos" icon={ThumbsUp} activeColor="#FC5200" drawBorder={true} autoResize={true} onClick={() => goTo("https://www.strava.com/activities/16668281692")}/>
                </div>
            </div>
        </div>
    )
}

export default CalloutMarathon