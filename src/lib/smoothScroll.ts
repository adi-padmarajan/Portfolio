import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

// Slow at both ends, so jumping between sections feels like a camera move rather than a snap
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

let lenis: Lenis | null = null;
// The intro and the mobile menu can each hold the page still; scrolling resumes once nothing does
let lockCount = 0;

// Glide to an in-page section (e.g. "#about") and record it in the address bar
export function scrollToHash(hash: string){
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;

    if (lenis) {
        // force: the menu may still be releasing its lock on the same frame the scroll starts
        lenis.scrollTo(target, { duration: 1.4, easing: easeInOutQuart, force: true });
    } else {
        target.scrollIntoView();
    }
    history.pushState(null, "", hash);
}

export function lockScroll(){
    lockCount++;
    document.body.style.overflow = "hidden";
    lenis?.stop();
}

export function unlockScroll(){
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;

    document.body.style.overflow = "";
    lenis?.start();
    // Hiding the scrollbar can shift the layout, so re-measure every trigger
    ScrollTrigger.refresh();
}

// Route every same-page "#section" link through the smooth scroll, unless its own handler already took over
function handleAnchorClick(e: MouseEvent){
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    const hash = link?.getAttribute("href");
    if (!hash || hash === "#") return;

    e.preventDefault();
    scrollToHash(hash);
}

// Drive the page with Lenis on GSAP's ticker, so smooth scrolling and ScrollTrigger share a single frame loop.
// Visitors who prefer reduced motion keep the browser's native, instant scrolling.
export function initSmoothScroll(){
    document.addEventListener("click", handleAnchorClick);

    if (!prefersReducedMotion()) {
        lenis = new Lenis({ lerp: 0.09 });
        lenis.on("scroll", ScrollTrigger.update);
        if (lockCount > 0) lenis.stop();
    }

    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    // Don't let GSAP "catch up" after a dropped frame; the scroll would visibly jump
    gsap.ticker.lagSmoothing(0);

    return () => {
        document.removeEventListener("click", handleAnchorClick);
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = null;
    };
}
