import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MOTION_OK } from "../lib/motion";

// The drawing's geometry: everything is centred in a 400-unit square
const SIZE = 400;
const C = SIZE / 2;
const COFFEE_R = 98;

// Soft wisps of steam drifting over the cup
const STEAM = [
    "M170 230 C150 200 190 180 170 150 C150 120 185 100 170 70",
    "M205 225 C225 195 185 170 210 140 C235 110 195 90 215 55",
    "M240 235 C255 210 225 190 245 160 C262 135 235 115 250 90",
];

const SVG_NS = "http://www.w3.org/2000/svg";

type CoffeeCupProps = {
    // Seconds before the coffee pours in, so the hero can choreograph it with the words
    delay?: number;
};

// A cup of black coffee seen from above: a black circle in a white cup, which suits a black and white site.
// The surface catches the light as the cursor moves, ripples where it's tapped, and steam drifts over it.
function CoffeeCup({ delay = 0 }: CoffeeCupProps){
    const id = useId();
    const svgRef = useRef<SVGSVGElement>(null);
    const coffeeRef = useRef<SVGCircleElement>(null);
    const highlightRef = useRef<SVGEllipseElement>(null);
    const ripplesRef = useRef<SVGGElement>(null);
    const steamRef = useRef<SVGGElement>(null);

    useLayoutEffect(() => {
        const svg = svgRef.current!;
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            // A ring spreading out from a point on the surface (and a fainter one just behind it), gone once it fades
            const ripple = (x: number, y: number, strength: number) => {
                [0, 0.18].forEach((lag, i) => {
                    const ring = document.createElementNS(SVG_NS, "circle");
                    ring.setAttribute("cx", String(x));
                    ring.setAttribute("cy", String(y));
                    ring.setAttribute("r", "0");
                    ring.setAttribute("fill", "none");
                    ring.setAttribute("stroke", "white");
                    ripplesRef.current?.appendChild(ring);
                    gsap.fromTo(ring, { attr: { r: 2, "stroke-width": 2 }, opacity: strength / (i + 1) }, {
                        attr: { r: COFFEE_R * 1.6, "stroke-width": 0.4 },
                        opacity: 0,
                        duration: 2.4,
                        delay: lag,
                        ease: "power2.out",
                        onComplete: () => ring.remove(),
                    });
                });
            };

            // Pour the coffee in, then let the light and the steam settle onto it
            gsap.timeline({ delay })
              .from(coffeeRef.current, { attr: { r: 0 }, duration: 1.4, ease: "power3.out" })
              .from(highlightRef.current, { autoAlpha: 0, duration: 1 }, "-=0.5")
              .add(() => ripple(C, C, 0.35), "-=1.1")
              .from(steamRef.current, { autoAlpha: 0, duration: 1.2 }, "-=0.6");

            // Each wisp rises and fades in its own rhythm, forever
            gsap.utils.toArray<SVGPathElement>(steamRef.current!.children).forEach((wisp, i) => {
                gsap.timeline({ repeat: -1, delay: i * 1.1 })
                  .fromTo(wisp, { y: 20, scaleY: 0.85, opacity: 0 }, { y: -30, scaleY: 1.1, duration: 3.6, ease: "none" })
                  .to(wisp, { opacity: 1, duration: 1.2, ease: "sine.out" }, 0)
                  .to(wisp, { opacity: 0, duration: 1.4, ease: "sine.in" }, 2.2);
            });

            // Now and then the surface stirs on its own, so the cup feels alive even when nobody touches it
            const idle = gsap.timeline({ repeat: -1, delay: delay + 4 })
              .add(() => ripple(C + gsap.utils.random(-30, 30), C + gsap.utils.random(-30, 30), 0.12))
              .to({}, { duration: 5 });

            // The light on the surface leans away from the cursor, as a reflection would
            const lightX = gsap.quickTo(highlightRef.current, "x", { duration: 1.2, ease: "power3.out" });
            const lightY = gsap.quickTo(highlightRef.current, "y", { duration: 1.2, ease: "power3.out" });
            const onMove = (e: PointerEvent) => {
                const rect = svg.getBoundingClientRect();
                const nx = gsap.utils.clamp(-1, 1, (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2));
                const ny = gsap.utils.clamp(-1, 1, (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2));
                lightX(-nx * 18);
                lightY(-ny * 12);
            };

            // A tap on the coffee drops a ring where it lands
            const onDown = (e: PointerEvent) => {
                const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
                if (Math.hypot(point.x - C, point.y - C) <= COFFEE_R) ripple(point.x, point.y, 0.6);
            };

            window.addEventListener("pointermove", onMove);
            svg.addEventListener("pointerdown", onDown);
            return () => {
                window.removeEventListener("pointermove", onMove);
                svg.removeEventListener("pointerdown", onDown);
                idle.kill();
                ripplesRef.current?.replaceChildren();
            };
        });
        return () => mm.revert();
    }, [delay]);

    return(
        <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label="A cup of black coffee, seen from above"
            className="block h-auto w-full overflow-visible"
        >
            <defs>
                {/* Black coffee is never quite black: a hint of brown in the middle, darkening towards the rim */}
                <radialGradient id={`${id}-coffee`} cx="45%" cy="42%" r="65%">
                    <stop offset="0%" stopColor="#1f1813" />
                    <stop offset="100%" stopColor="#030202" />
                </radialGradient>
                <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" />
                </filter>
                <filter id={`${id}-steam`} x="-100%" y="-50%" width="300%" height="200%">
                    <feGaussianBlur stdDeviation="5" />
                </filter>
                <clipPath id={`${id}-surface`}>
                    <circle cx={C} cy={C} r={COFFEE_R} />
                </clipPath>
            </defs>

            {/* Saucer, with the shallow well the cup sits in */}
            <circle cx={C} cy={C} r={180} fill="white" stroke="rgb(0 0 0 / 0.1)" />
            <circle cx={C} cy={C} r={132} fill="none" stroke="rgb(0 0 0 / 0.05)" />

            {/* The cup's shadow on the saucer, then the handle, then the cup over the handle's root */}
            <circle cx={C + 6} cy={C + 10} r={118} fill="rgb(0 0 0 / 0.08)" filter={`url(#${id}-soft)`} />
            <rect
                x={C + 96}
                y={C - 15}
                width={64}
                height={30}
                rx={15}
                transform={`rotate(-35 ${C} ${C})`}
                fill="white"
                stroke="rgb(0 0 0 / 0.15)"
            />
            <circle cx={C} cy={C} r={118} fill="white" stroke="rgb(0 0 0 / 0.15)" />
            <circle cx={C} cy={C} r={COFFEE_R + 6} fill="none" stroke="rgb(0 0 0 / 0.08)" />

            {/* The coffee, its ripples and the window light on its surface */}
            <circle ref={coffeeRef} cx={C} cy={C} r={COFFEE_R} fill={`url(#${id}-coffee)`} />
            <g clipPath={`url(#${id}-surface)`}>
                <g ref={ripplesRef} />
                <ellipse
                    ref={highlightRef}
                    cx={C - 34}
                    cy={C - 40}
                    rx={40}
                    ry={15}
                    transform={`rotate(-30 ${C - 34} ${C - 40})`}
                    fill="white"
                    fillOpacity={0.16}
                    filter={`url(#${id}-soft)`}
                />
            </g>

            <g ref={steamRef} fill="none" stroke="rgb(156 163 175 / 0.35)" strokeWidth={10} strokeLinecap="round" filter={`url(#${id}-steam)`}>
                {STEAM.map((d) => <path key={d} d={d} />)}
            </g>
        </svg>
    );
}

export default CoffeeCup;
