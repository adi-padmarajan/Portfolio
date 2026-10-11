import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";
import { scrollToHash } from "../lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

// A small cup, seen from above like the hero's, in a 100-unit square
const C = 50;
const COFFEE_R = 27;

// How far down the page you are, as a cup of coffee you finish as you read. It turns up once you've left the hero
// (which has its own cup), empties as you scroll towards the end and fills again on the way back up. It's also the
// way home: pressing it glides back to the top.
// It never sits in the way: where there's no clear margin beside the content it steps aside while you read on and
// comes back as soon as you scroll up, and it bows out at the footer, which has its own way back to the top.
const WIDE = "(min-width: 1280px)";
function CoffeeProgress(){
    const id = useId();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const levelRef = useRef<SVGCircleElement>(null);

    useLayoutEffect(() => {
        const button = buttonRef.current!;
        const level = levelRef.current!;
        const still = prefersReducedMotion();
        let shown = false;
        let atFooter = false;
        let readingOn = false;
        const wide = window.matchMedia(WIDE);
        gsap.set(button, { autoAlpha: 0, scale: 0.6, y: 12 });

        const show = (visible: boolean) => {
            if (visible === shown) return;
            shown = visible;
            const vars = { autoAlpha: visible ? 1 : 0, scale: visible ? 1 : 0.6, y: visible ? 0 : 12 };
            if (still) gsap.set(button, vars);
            else gsap.to(button, { ...vars, duration: visible ? 0.6 : 0.35, ease: visible ? "back.out(1.7)" : "power2.in", overwrite: true });
        };

        // The level follows the scroll exactly (no easing to lag behind), from a full cup as About arrives to an
        // empty one at the bottom of the page
        const sync = (self: ScrollTrigger) => {
            level.setAttribute("r", String(COFFEE_R * (1 - self.progress)));
            show(self.scroll() >= self.start && !atFooter && (wide.matches || !readingOn));
        };
        const trigger = ScrollTrigger.create({
            trigger: "#about",
            start: "top 70%",
            endTrigger: document.documentElement,
            end: "bottom bottom",
            onUpdate: (self) => {
                readingOn = self.direction === 1;
                sync(self);
            },
            onRefresh: sync,
        });
        const footer = ScrollTrigger.create({
            trigger: "[data-wordmark]",
            start: "top bottom",
            onToggle: (self) => {
                atFooter = self.isActive;
                sync(trigger);
            },
        });
        const onResize = () => sync(trigger);
        wide.addEventListener("change", onResize);

        return () => {
            trigger.kill();
            footer.kill();
            wide.removeEventListener("change", onResize);
        };
    }, []);

    return(
        <button
            ref={buttonRef}
            type="button"
            aria-label="Back to top"
            title="Back to top"
            onClick={() => scrollToHash("#top")}
            className="fixed right-4 bottom-4 z-30 h-12 w-12 cursor-pointer rounded-full transition-[translate] duration-300 hover:-translate-y-1 sm:right-6 sm:bottom-6 sm:h-14 sm:w-14 focus-visible:outline-[#2a170c]"
        >
            <svg viewBox="0 0 100 100" aria-hidden="true" className="block h-full w-full overflow-visible drop-shadow-[0_4px_10px_rgb(43_29_18_/_0.18)]">
                <defs>
                    <radialGradient id={`${id}-coffee`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#2a170c" />
                        <stop offset="80%" stopColor="#1f1008" />
                        <stop offset="100%" stopColor="#6b3d1c" />
                    </radialGradient>
                    <linearGradient id={`${id}-wall`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
                        <stop offset="0%" stopColor="#cfcac4" />
                        <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                </defs>
                {/* Saucer (its hairline keeps it crisp over Contact's dark background too), handle, cup and coffee */}
                <circle cx={C} cy={C} r={48} fill="#ffffff" stroke="#d8d4cf" strokeWidth={1} />
                <rect x={C + 26} y={C - 6} width={18} height={12} rx={6} transform={`rotate(-35 ${C} ${C})`} fill="#ffffff" stroke="#d8d4cf" strokeWidth={1} />
                <circle cx={C} cy={C} r={34} fill="#ffffff" stroke="#d8d4cf" strokeWidth={1} />
                <circle cx={C} cy={C} r={30} fill={`url(#${id}-wall)`} />
                <circle ref={levelRef} cx={C} cy={C} r={COFFEE_R} fill={`url(#${id}-coffee)`} />
            </svg>
        </button>
    );
}

export default CoffeeProgress;
