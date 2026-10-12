// When each of my three cups usually happens, in minutes after midnight in Vancouver: 7:30, noon and 3:30
export const CUPS = [7.5 * 60, 12 * 60, 15.5 * 60];

/** Returns how many cups I've probably had by a given time of day, in minutes after midnight. */
export function cupsBy(minutes: number){
    return CUPS.filter((cup) => minutes >= cup).length;
}
