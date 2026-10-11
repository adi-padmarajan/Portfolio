import { useEffect, useState } from "react";
import LocalTime from "./LocalTime";

const hourFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: "America/Vancouver",
});

const vancouverHour = () => Number(hourFormatter.format(new Date()));

// My local time with an honest guess at whether I'm up, so a late-night message doesn't wait on a reply in silence
function AwakeStatus(){
    const [hour, setHour] = useState(vancouverHour);

    useEffect(() => {
        const interval = setInterval(() => setHour(vancouverHour()), 60_000);
        return () => clearInterval(interval);
    }, []);

    const awake = hour >= 8 && hour < 23;

    return(
        <p className="flex items-start gap-3 text-sm leading-relaxed text-white/60 sm:text-base">
            <span aria-hidden="true" className="relative mt-[0.45em] flex h-2 w-2 shrink-0">
                {awake && <span className="absolute inset-0 rounded-full bg-emerald-400 motion-safe:animate-ping" />}
                <span className={`h-2 w-2 rounded-full ${awake ? "bg-emerald-400" : "bg-white/30"}`} />
            </span>
            <span>
                It’s <span className="whitespace-nowrap text-white"><LocalTime /></span> in Vancouver.{" "}
                {awake ? "I’m probably awake." : "I’m probably asleep, so expect a reply in the morning."}
            </span>
        </p>
    );
}

export default AwakeStatus;
