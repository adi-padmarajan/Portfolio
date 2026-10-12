import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK, prefersReducedMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

// A double-walled glass seen from the side, in a 200-unit square. The inner wall floats above the outer one's
// base, which is what makes the coffee look suspended in the glass.
const TOP = 54;
const FLOOR = 138;
const TOP_HALF = 35;
const FLOOR_HALF = 29.5;
// Where the glass pivots when it's tipped for a sip: the middle of its base
const BASE = "100 158";

// The coffee's level, as the height of its surface: full near the rim, down to a last film on the floor
const FULL = 68;
const SIPS = [90, 112, 130];
const DREGS = 136;

/** Half the inner glass's width at a given height, since its wall tapers towards the floor. */
const halfWidthAt = (y: number) => TOP_HALF - ((y - TOP) * (TOP_HALF - FLOOR_HALF)) / (FLOOR - TOP);

// Soft wisps of steam curling up off the rim
const STEAM = [
    "M88 46 C80 36 96 28 88 18 C82 10 92 4 88 -4",
    "M104 44 C112 34 98 26 106 16 C112 8 102 2 106 -8",
    "M118 47 C124 39 112 32 118 24 C123 17 115 12 118 4",
];

// A glass of black coffee, drunk while you read. As it scrolls past it's tipped towards you for a sip (the coffee
// staying level as the glass tilts), the level drops a little each time and the steam thins as it cools; the last
// sip leaves a film on the floor. Scrolling back up pours it back. Pressing it swirls the coffee.
function CoffeeGlass(){
    const id = useId();
    // Read once: without motion the glass is just a picture, so it isn't offered as a button
    const [interactive] = useState(() => !prefersReducedMotion());
    const buttonRef = useRef<HTMLButtonElement>(null);
    const glassRef = useRef<SVGGElement>(null);
    const levelRef = useRef<SVGGElement>(null);
    const liquidRef = useRef<SVGRectElement>(null);
    const surfaceRef = useRef<SVGEllipseElement>(null);
    const steamRef = useRef<SVGGElement>(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const button = buttonRef.current;
            if (!button) return;
            const wisps = gsap.utils.toArray<SVGPathElement>(steamRef.current!.children);
            gsap.set([glassRef.current, levelRef.current], { svgOrigin: BASE });

            // The coffee's surface: the liquid fills from the surface down, and the crema ellipse narrows with the
            // tapering wall as the level drops
            const level = { y: FULL };
            const setLevel = () => {
                liquidRef.current!.setAttribute("y", String(level.y));
                liquidRef.current!.setAttribute("height", String(FLOOR + 4 - level.y));
                surfaceRef.current!.setAttribute("cy", String(level.y));
                surfaceRef.current!.setAttribute("rx", String(halfWidthAt(level.y)));
            };
            setLevel();

            // It's set down as it scrolls into view, already full and steaming
            const arrive = gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: button, start: "top 85%" } })
              .from(button, { autoAlpha: 0, duration: 0.8 })
              .from(glassRef.current, { y: -14, duration: 1.1 }, 0);

            // Each sip tips the glass towards you while the coffee inside stays level (it turns the other way by
            // the same amount), lowers the level, and sets the glass back down. The steam thins as it goes, and
            // the last sip leaves only a film.
            const drinking = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });
            SIPS.forEach((y, i) => {
                const at = 0.08 + i * 0.26;
                drinking
                  .to(glassRef.current, { rotate: -9, duration: 0.07 }, at)
                  .to(levelRef.current, { rotate: 9, duration: 0.07 }, at)
                  .to(level, { y, duration: 0.1, onUpdate: setLevel }, at + 0.04)
                  .to(glassRef.current, { rotate: 0, duration: 0.08 }, at + 0.12)
                  .to(levelRef.current, { rotate: 0, duration: 0.08 }, at + 0.12);
            });
            drinking
              .to(level, { y: DREGS, duration: 0.08, onUpdate: setLevel }, 0.88)
              .to(liquidRef.current, { opacity: 0.3, duration: 0.08 }, 0.88)
              .to(surfaceRef.current, { opacity: 0, duration: 0.08 }, 0.88)
              .to(steamRef.current, { autoAlpha: 0, duration: 0.6, ease: "none" }, 0.3)
              .to({}, { duration: 0.04 }, 0.96);

            // Full while you read beside it; the sips come as you scroll on towards the details
            const sipping = ScrollTrigger.create({
                trigger: button,
                start: "center 40%",
                end: "center top",
                scrub: 0.8,
                animation: drinking,
            });

            // Each wisp rises, sways and fades in its own rhythm, only while the glass is on screen
            const loops = wisps.map((wisp, i) =>
                gsap.timeline({ paused: true, repeat: -1, delay: i * 1.2 })
                  .fromTo(wisp, { y: 10, opacity: 0 }, { y: -18, duration: 4, ease: "none" })
                  .to(wisp, { x: i % 2 ? 5 : -5, duration: 2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0)
                  .to(wisp, { opacity: 1, duration: 1.3, ease: "sine.out" }, 0)
                  .to(wisp, { opacity: 0, duration: 1.5, ease: "sine.in" }, 2.5),
            );
            const visibility = ScrollTrigger.create({
                trigger: button,
                start: "top bottom",
                end: "bottom top",
                onToggle: (self) => loops.forEach((loop) => (self.isActive ? loop.resume() : loop.pause())),
            });

            // A press swirls the coffee: it sloshes to one side and rocks back and forth until it settles
            const swirl = () => gsap.fromTo(surfaceRef.current, { rotate: 7, svgOrigin: `100 ${level.y}` }, {
                rotate: 0,
                duration: 1.6,
                ease: "elastic.out(1.1, 0.25)",
                overwrite: "auto",
            });
            // With a mouse the glass lifts a touch on hover, like it's about to be picked up
            const lift = (e: PointerEvent) => {
                if (e.pointerType === "mouse") gsap.to(button, { y: -4, duration: 0.4, ease: "power2.out" });
            };
            const settle = () => gsap.to(button, { y: 0, duration: 0.5, ease: "power2.out" });

            button.addEventListener("click", swirl);
            button.addEventListener("pointerenter", lift);
            button.addEventListener("pointerleave", settle);
            return () => {
                button.removeEventListener("click", swirl);
                button.removeEventListener("pointerenter", lift);
                button.removeEventListener("pointerleave", settle);
                loops.forEach((loop) => loop.kill());
                [arrive, drinking].forEach((animation) => animation.kill());
                [sipping, visibility].forEach((trigger) => trigger.kill());
            };
        });
        return () => mm.revert();
    }, []);

    const inner = `M${100 - TOP_HALF} ${TOP} L${100 - FLOOR_HALF} ${FLOOR - 8} Q${100 - FLOOR_HALF + 0.5} ${FLOOR} ${100 - FLOOR_HALF + 8} ${FLOOR} L${100 + FLOOR_HALF - 8} ${FLOOR} Q${100 + FLOOR_HALF - 0.5} ${FLOOR} ${100 + FLOOR_HALF} ${FLOOR - 8} L${100 + TOP_HALF} ${TOP} Z`;

    const drawing = (
        <svg viewBox="31 14 166 166" aria-hidden="true" className="block h-auto w-full overflow-visible">
            <defs>
                {/* Black coffee through glass: deepest at the bottom, a warm brown near the top where light gets in */}
                <linearGradient id={`${id}-coffee`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a2a14" />
                    <stop offset="35%" stopColor="#2a160a" />
                    <stop offset="100%" stopColor="#120904" />
                </linearGradient>
                {/* Where the coffee is thinnest, against the curved wall, it glows amber */}
                <linearGradient id={`${id}-edges`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8a5126" stopOpacity="0.55" />
                    <stop offset="22%" stopColor="#8a5126" stopOpacity="0" />
                    <stop offset="78%" stopColor="#8a5126" stopOpacity="0" />
                    <stop offset="100%" stopColor="#8a5126" stopOpacity="0.4" />
                </linearGradient>
                <radialGradient id={`${id}-crema`} cx="45%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#c99566" />
                    <stop offset="100%" stopColor="#8a5a30" />
                </radialGradient>
                <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="12%" stopColor="#f1f3f5" stopOpacity="0.5" />
                    <stop offset="85%" stopColor="#e9ecef" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#dde1e5" stopOpacity="0.7" />
                </linearGradient>
                <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" />
                </filter>
                <clipPath id={`${id}-inside`}>
                    <path d={inner} />
                </clipPath>
            </defs>

            {/* Its shadow on the table */}
            <ellipse cx="100" cy="161" rx="44" ry="4.5" fill="#000000" opacity="0.1" filter={`url(#${id}-soft)`} />

            <g ref={glassRef}>
                {/* The handle: a loop of glass, drawn as a thick pale stroke with a thinner bright one inside it */}
                <path d="M137 74 C160 72 166 84 165 100 C164 118 154 128 133 128" fill="none" stroke="#dfe3e7" strokeWidth="7" strokeLinecap="round" />
                <path d="M137 74 C160 72 166 84 165 100 C164 118 154 128 133 128" fill="none" stroke="#c9ced4" strokeWidth="7.5" strokeLinecap="round" strokeOpacity="0.35" />
                <path d="M139 76 C157 75 162 86 161.5 100 C161 115 153 124 135 125" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />

                {/* The outer wall, faintly tinted, with its base */}
                <path d="M60 52 L67 148 Q68 158 77 158 L123 158 Q132 158 133 148 L140 52 Z" fill={`url(#${id}-glass)`} stroke="#c9ced4" strokeWidth="1" />

                {/* The coffee, held inside the inner wall */}
                <g clipPath={`url(#${id}-inside)`}>
                    <g ref={levelRef}>
                        <rect ref={liquidRef} x="40" y={FULL} width="120" height={FLOOR + 4 - FULL} fill={`url(#${id}-coffee)`} />
                        <rect x="40" y="40" width="120" height="120" fill={`url(#${id}-edges)`} />
                        <ellipse ref={surfaceRef} cx="100" cy={FULL} rx={halfWidthAt(FULL)} ry="4" fill={`url(#${id}-crema)`} />
                    </g>
                </g>

                {/* The inner wall and the gap between the walls, then the rim and the light running down the glass */}
                <path d={inner} fill="none" stroke="#d6dade" strokeWidth="0.8" />
                <ellipse cx="100" cy="52" rx="40" ry="4" fill="none" stroke="#c4c9cf" strokeWidth="1" />
                <ellipse cx="100" cy={TOP} rx={TOP_HALF} ry="3.2" fill="none" stroke="#dfe3e7" strokeWidth="0.8" />
                <path d="M66 62 L72 146" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
                <path d="M134 64 L129 140" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </g>

            <g ref={steamRef} fill="none" stroke="#d1d5db" strokeOpacity="0.6" strokeWidth="5" strokeLinecap="round" filter={`url(#${id}-soft)`}>
                {STEAM.map((d) => <path key={d} d={d} />)}
            </g>
        </svg>
    );

    if (!interactive) {
        return <div role="img" aria-label="A glass of black coffee">{drawing}</div>;
    }
    // A real button, so tapping, clicking and the keyboard can all swirl the coffee
    return(
        <button
            ref={buttonRef}
            type="button"
            aria-label="Swirl the coffee"
            className="block w-full cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent]"
        >
            {drawing}
        </button>
    );
}

export default CoffeeGlass;
