import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK, prefersReducedMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

// The drawing's geometry: everything is centred in a 400-unit square, lit from the top left
const SIZE = 400;
const C = SIZE / 2;
const SAUCER_R = 182;
const CUP_R = 120;
const WALL_R = 110;
const COFFEE_R = 100;
// Every transform turns and scales about the cup's centre, so nothing drifts off-axis
const CENTRE = `${C} ${C}`;

// Soft wisps of steam curling up off the surface
const STEAM = [
    "M172 232 C152 204 190 182 170 152 C152 124 184 104 170 74",
    "M206 226 C226 196 186 172 210 142 C234 112 196 92 214 58",
    "M240 236 C256 210 226 190 246 162 C262 136 236 116 250 92",
];

const SVG_NS = "http://www.w3.org/2000/svg";

type CoffeeCupProps = {
    // Seconds before the cup is set down, so the hero can choreograph it with the words
    delay?: number;
};

// A cup of black coffee seen from above. It's set down on its saucer, poured, and left steaming; the surface catches
// the light as the cursor moves, and pressing the cup sends rings out from the middle, like a knock on the table.
function CoffeeCup({ delay = 0 }: CoffeeCupProps){
    const id = useId();
    // Read once: without motion the cup is just a picture, so it isn't offered as a button
    const [interactive] = useState(() => !prefersReducedMotion());
    const buttonRef = useRef<HTMLButtonElement>(null);
    const cupRef = useRef<SVGGElement>(null);
    const shadowRef = useRef<SVGCircleElement>(null);
    const liquidRef = useRef<SVGGElement>(null);
    const ripplesRef = useRef<SVGGElement>(null);
    const lightRef = useRef<SVGGElement>(null);
    const steamRef = useRef<SVGGElement>(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const button = buttonRef.current;
            if (!button) return;
            const wisps = gsap.utils.toArray<SVGPathElement>(steamRef.current!.children);
            gsap.set([cupRef.current, shadowRef.current, liquidRef.current, lightRef.current, ...wisps], { svgOrigin: CENTRE });
            let poured = false;

            // Rings spreading evenly from the centre: a light crest with a dark trough just inside it.
            // They grow by scaling while their strokes keep their weight, so every ring stays perfectly round.
            const ripple = (strength: number, waves = 3) => {
                for (let i = 0; i < waves; i++) {
                    const wave = document.createElementNS(SVG_NS, "g");
                    wave.innerHTML =
                        `<circle cx="${C}" cy="${C}" r="${COFFEE_R}" fill="none" stroke="rgb(255 226 196 / 0.55)" stroke-width="1.6" vector-effect="non-scaling-stroke" />` +
                        `<circle cx="${C}" cy="${C}" r="${COFFEE_R - 4}" fill="none" stroke="rgb(0 0 0 / 0.6)" stroke-width="2.2" vector-effect="non-scaling-stroke" />`;
                    ripplesRef.current?.appendChild(wave);
                    gsap.set(wave, { svgOrigin: CENTRE, scale: 0.03, opacity: strength * (1 - i * 0.25) });
                    gsap.to(wave, {
                        scale: 1.02,
                        opacity: 0,
                        duration: 2.2,
                        delay: i * 0.28,
                        ease: "sine.out",
                        onComplete: () => wave.remove(),
                    });
                }
                // The reflection shivers as the rings pass under it, then settles
                gsap.fromTo(lightRef.current, { scaleX: 1 + strength * 0.25, scaleY: 1 - strength * 0.2 }, {
                    scaleX: 1,
                    scaleY: 1,
                    duration: 1.8,
                    ease: "elastic.out(1, 0.3)",
                    overwrite: "auto",
                });
            };

            // Set the cup down on its saucer (the shadow tightening as it lands), pour the coffee in with a swirl,
            // then let the steam rise
            const intro = gsap.timeline({ delay, defaults: { ease: "power3.out" } })
              .from(button, { autoAlpha: 0, duration: 0.8 })
              .from(cupRef.current, { scale: 1.12, y: -10, duration: 1.1 }, 0)
              .from(shadowRef.current, { scale: 1.25, x: 18, y: 24, opacity: 0, duration: 1.1 }, 0)
              .from(liquidRef.current, { scale: 0, rotate: -120, duration: 1.6 }, 0.8)
              .add(() => ripple(0.6), 1.9)
              .from(steamRef.current, { autoAlpha: 0, duration: 1.6, ease: "sine.inOut" }, 2.1)
              .add(() => { poured = true; });

            // Each wisp rises, sways and fades in its own rhythm
            const loops: gsap.core.Animation[] = wisps.map((wisp, i) =>
                gsap.timeline({ paused: true, repeat: -1, delay: i * 1.3 })
                  .fromTo(wisp, { y: 24, scaleY: 0.8, opacity: 0 }, { y: -34, scaleY: 1.15, duration: 4.2, ease: "none" })
                  .to(wisp, { x: i % 2 ? 10 : -10, duration: 2.1, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0)
                  .to(wisp, { opacity: 1, duration: 1.4, ease: "sine.out" }, 0)
                  .to(wisp, { opacity: 0, duration: 1.6, ease: "sine.in" }, 2.6),
            );

            // Now and then the surface stirs on its own, so the cup feels alive even when nobody touches it
            loops.push(
                gsap.timeline({ paused: true, repeat: -1, delay: delay + 8 })
                  .add(() => ripple(0.22, 2))
                  .to({}, { duration: 6 }),
            );

            // The loops start paused and only run while the cup is on screen, even if the page loads scrolled past it
            const visibility = ScrollTrigger.create({
                trigger: button,
                start: "top bottom",
                end: "bottom top",
                onToggle: (self) => loops.forEach((loop) => (self.isActive ? loop.resume() : loop.pause())),
            });

            // The light on the surface leans away from the cursor, and the coffee (sitting lower than the rim)
            // drifts a touch against it, so the cup reads as having depth
            const lightX = gsap.quickTo(lightRef.current, "x", { duration: 1.2, ease: "power3.out" });
            const lightY = gsap.quickTo(lightRef.current, "y", { duration: 1.2, ease: "power3.out" });
            const liquidX = gsap.quickTo(liquidRef.current, "x", { duration: 1.4, ease: "power3.out" });
            const liquidY = gsap.quickTo(liquidRef.current, "y", { duration: 1.4, ease: "power3.out" });
            const onMove = (e: PointerEvent) => {
                if (e.pointerType !== "mouse") return;
                const rect = button.getBoundingClientRect();
                const nx = gsap.utils.clamp(-1, 1, (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2));
                const ny = gsap.utils.clamp(-1, 1, (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2));
                lightX(-nx * 16);
                lightY(-ny * 12);
                liquidX(nx * 3);
                liquidY(ny * 3);
            };

            // Tactile feedback: the cup gives under a press, springs back, and a click knocks it with a little clink
            const press = () => gsap.to(cupRef.current, { scale: 0.96, duration: 0.18, ease: "power2.out", overwrite: "auto" });
            const release = () => gsap.to(cupRef.current, { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
            const clink = () => {
                if (!poured) return;
                gsap.to(cupRef.current, { keyframes: { rotate: [0, 3, -2, 1, 0] }, duration: 0.6, ease: "power1.inOut" });
                ripple(0.9);
            };

            // With a mouse, the cup lifts on hover (its shadow spreading) and the steam quickens
            const hover = gsap.timeline({ paused: true, defaults: { duration: 0.5, ease: "power2.out" } })
              .to(cupRef.current, { y: -4 }, 0)
              .to(shadowRef.current, { x: 5, y: 7, opacity: 0.3, scale: 1.04 }, 0);
            const onEnter = (e: PointerEvent) => {
                if (e.pointerType !== "mouse") return;
                hover.play();
                loops.forEach((loop) => loop.timeScale(1.6));
            };
            const onLeave = () => {
                hover.reverse();
                loops.forEach((loop) => loop.timeScale(1));
                release();
            };

            window.addEventListener("pointermove", onMove);
            button.addEventListener("pointerdown", press);
            button.addEventListener("pointerup", release);
            button.addEventListener("pointercancel", release);
            button.addEventListener("pointerenter", onEnter);
            button.addEventListener("pointerleave", onLeave);
            button.addEventListener("click", clink);
            return () => {
                window.removeEventListener("pointermove", onMove);
                button.removeEventListener("pointerdown", press);
                button.removeEventListener("pointerup", release);
                button.removeEventListener("pointercancel", release);
                button.removeEventListener("pointerenter", onEnter);
                button.removeEventListener("pointerleave", onLeave);
                button.removeEventListener("click", clink);
                loops.forEach((loop) => loop.kill());
                intro.kill();
                visibility.kill();
                ripplesRef.current?.replaceChildren();
            };
        });
        return () => mm.revert();
    }, [delay]);

    const drawing = (
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" className="block h-auto w-full overflow-visible">
            <defs>
                {/* Glazed white porcelain, catching the light on its upper left */}
                <radialGradient id={`${id}-saucer`} cx="40%" cy="36%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#f7f6f4" />
                    <stop offset="100%" stopColor="#e6e4e1" />
                </radialGradient>
                <radialGradient id={`${id}-cup`} cx="38%" cy="34%" r="72%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="65%" stopColor="#f8f7f5" />
                    <stop offset="100%" stopColor="#dedbd7" />
                </radialGradient>
                {/* Seen from above, the inner wall turned towards the light is bright and the one facing away is shaded */}
                <linearGradient id={`${id}-wall`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
                    <stop offset="0%" stopColor="#cfcac4" />
                    <stop offset="55%" stopColor="#efedea" />
                    <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <linearGradient id={`${id}-handle`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e2dfdb" />
                </linearGradient>
                {/* Black coffee is really a very dark brown: deepest in the middle, warming to amber where it
                    thins against the porcelain */}
                <radialGradient id={`${id}-coffee`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2a170c" />
                    <stop offset="60%" stopColor="#1f1008" />
                    <stop offset="85%" stopColor="#33190b" />
                    <stop offset="95%" stopColor="#552d13" />
                    <stop offset="100%" stopColor="#7d4720" />
                </radialGradient>
                {/* The rim's shadow falling across the surface on the lit side */}
                <linearGradient id={`${id}-rim-shadow`} x1="0.1" y1="0.05" x2="0.6" y2="0.6">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
                    <stop offset="45%" stopColor="#000000" stopOpacity="0" />
                </linearGradient>
                <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff4e8" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#fff4e8" stopOpacity="0" />
                </radialGradient>
                <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="9" />
                </filter>
                <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" />
                </filter>
                <filter id={`${id}-steam`} x="-100%" y="-50%" width="300%" height="200%">
                    <feGaussianBlur stdDeviation="6" />
                </filter>
                <clipPath id={`${id}-surface`}>
                    <circle cx={C} cy={C} r={COFFEE_R} />
                </clipPath>
            </defs>

            {/* Saucer, with the shallow well the cup sits in */}
            <circle cx={C} cy={C} r={SAUCER_R} fill={`url(#${id}-saucer)`} stroke="#e3e0dc" strokeWidth={0.8} />
            <circle cx={C} cy={C} r={SAUCER_R - 3} fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.9} />
            <circle cx={C} cy={C} r={136} fill="none" stroke="#000000" strokeOpacity={0.06} strokeWidth={4} filter={`url(#${id}-blur)`} />
            <circle cx={C} cy={C} r={139} fill="none" stroke="#ffffff" strokeWidth={1.5} />

            <circle ref={shadowRef} cx={C + 9} cy={C + 13} r={CUP_R} fill="#2b1d12" opacity={0.22} filter={`url(#${id}-shadow)`} />

            <g ref={cupRef}>
                {/* Handle, angled up and away, with its own soft shadow */}
                <g transform={`rotate(-35 ${C} ${C})`}>
                    <rect x={C + 104} y={C - 12} width={66} height={32} rx={16} fill="#2b1d12" opacity={0.12} filter={`url(#${id}-blur)`} />
                    <rect x={C + 100} y={C - 16} width={66} height={32} rx={16} fill={`url(#${id}-handle)`} stroke="#dcd8d3" strokeWidth={0.8} />
                </g>

                {/* The cup's outside and glazed rim, then the inner wall dropping down to the coffee */}
                <circle cx={C} cy={C} r={CUP_R} fill={`url(#${id}-cup)`} stroke="#d8d4cf" strokeWidth={0.8} />
                <circle cx={C} cy={C} r={CUP_R - 2} fill="none" stroke="#ffffff" strokeWidth={2} />
                <circle cx={C} cy={C} r={WALL_R} fill={`url(#${id}-wall)`} stroke="#e0dcd7" strokeWidth={0.8} />

                <g clipPath={`url(#${id}-surface)`}>
                    <g ref={liquidRef}>
                        <circle cx={C} cy={C} r={COFFEE_R + 4} fill={`url(#${id}-coffee)`} />
                        <g ref={ripplesRef} />
                        {/* A window's soft reflection and a sharper glint of light */}
                        <g ref={lightRef}>
                            <ellipse cx={C - 30} cy={C - 36} rx={52} ry={26} transform={`rotate(-32 ${C - 30} ${C - 36})`} fill={`url(#${id}-glow)`} />
                            <ellipse cx={C - 42} cy={C - 46} rx={16} ry={5} transform={`rotate(-32 ${C - 42} ${C - 46})`} fill="#fff8f0" opacity={0.55} filter={`url(#${id}-blur)`} />
                        </g>
                    </g>
                    <circle cx={C} cy={C} r={COFFEE_R} fill={`url(#${id}-rim-shadow)`} />
                </g>
                {/* The thin amber line where the coffee meets the porcelain */}
                <circle cx={C} cy={C} r={COFFEE_R - 0.5} fill="none" stroke="#9a6236" strokeOpacity={0.45} strokeWidth={1.2} />
            </g>

            <g ref={steamRef} fill="none" stroke="#d6d0ca" strokeOpacity={0.3} strokeWidth={11} strokeLinecap="round" filter={`url(#${id}-steam)`}>
                {STEAM.map((d) => <path key={d} d={d} />)}
            </g>
        </svg>
    );

    if (!interactive) {
        return <div role="img" aria-label="A cup of black coffee, seen from above">{drawing}</div>;
    }
    // A real button, so tapping, clicking and the keyboard all stir the coffee
    return(
        <button
            ref={buttonRef}
            type="button"
            aria-label="Stir the coffee"
            className="block w-full cursor-pointer touch-manipulation rounded-full [-webkit-tap-highlight-color:transparent] focus-visible:outline-offset-8"
        >
            {drawing}
        </button>
    );
}

export default CoffeeCup;
