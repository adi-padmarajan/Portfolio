// My clock: the hour and minute it is in Vancouver right now, for the details that follow my day
const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
    timeZone: "America/Vancouver",
});

/** Returns the current time in America/Vancouver as minutes since midnight, from 0 through 1439. */
export function vancouverMinutes(now = new Date()){
    const parts = formatter.formatToParts(now);
    const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    return part("hour") * 60 + part("minute");
}

/** Returns the current hour in America/Vancouver, from 0 through 23. */
export function vancouverHour(now = new Date()){
    return Math.floor(vancouverMinutes(now) / 60);
}
