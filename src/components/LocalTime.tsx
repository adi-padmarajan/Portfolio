import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Vancouver",
    timeZoneName: "short",
});

// My current time in Vancouver, ticking along so visitors know when I'm likely to reply
function LocalTime(){
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return <time dateTime={now.toISOString()}>{formatter.format(now)}</time>;
}

export default LocalTime;
