// Media query for visitors who are fine with motion; animations are registered under it with gsap.matchMedia(),
// so they never run (and revert cleanly) for anyone who prefers reduced motion
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion(){
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
