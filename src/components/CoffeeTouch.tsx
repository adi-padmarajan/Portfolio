import { useEffect, useRef } from "react";
import gsap from "gsap";
import { drinkColor, getCoffeeOrder } from "../lib/coffeeOrder";
import { MOTION_OK } from "../lib/motion";

// What counts as a tap rather than the start of a scroll: a touch that lifts close to where it landed, soon after
const TAP_SLOP = 12;
const TAP_TIME = 600;

// The touch-screen counterpart to the cursor companion. There's no cursor to keep company on a phone, so the
// visitor's drink answers their taps instead: a ripple spreads from under the finger in the drink's colour, with a
// few droplets splashing out, and is gone in a moment. Only real taps count (a touch that turns into a scroll is
// cancelled by the browser), and it never gets in the way of what was tapped.
function CoffeeTouch(){
    const layerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const layer = layerRef.current;
        if (!layer || !window.matchMedia(MOTION_OK).matches) return;

        // Each finger on the screen is its own possible tap, so a second touch never overwrites or cancels the first
        const touches = new Map<number, { x: number; y: number; at: number }>();

        const splash = (x: number, y: number) => {
            const color = drinkColor(getCoffeeOrder());
            const make = (className: string, size: number) => {
                const el = document.createElement("span");
                el.className = `absolute rounded-full ${className}`;
                Object.assign(el.style, { left: `${x - size / 2}px`, top: `${y - size / 2}px`, width: `${size}px`, height: `${size}px` });
                layer.appendChild(el);
                return el;
            };

            // Two rings, the second a beat behind the first, like a drop landing in a cup
            [0, 0.09].forEach((delay, i) => {
                const ring = make("border-2", 64);
                ring.style.borderColor = color;
                gsap.fromTo(ring, { scale: 0.1, opacity: i ? 0.45 : 0.75 }, {
                    scale: i ? 0.8 : 1,
                    opacity: 0,
                    duration: 0.65,
                    delay,
                    ease: "power2.out",
                    onComplete: () => ring.remove(),
                });
            });

            // And a few droplets thrown clear, each at its own angle
            for (let i = 0; i < 4; i++) {
                const drop = make("", gsap.utils.random(4, 7));
                drop.style.backgroundColor = color;
                const angle = (i / 4) * Math.PI * 2 + gsap.utils.random(-0.5, 0.5);
                const reach = gsap.utils.random(18, 30);
                gsap.fromTo(drop, { x: 0, y: 0, scale: 1, opacity: 0.9 }, {
                    x: Math.cos(angle) * reach,
                    y: Math.sin(angle) * reach,
                    scale: 0.2,
                    opacity: 0,
                    duration: 0.55,
                    ease: "power2.out",
                    onComplete: () => drop.remove(),
                });
            }
        };

        const onDown = (e: PointerEvent) => {
            if (e.pointerType === "mouse") return;
            touches.set(e.pointerId, { x: e.clientX, y: e.clientY, at: e.timeStamp });
        };
        const onUp = (e: PointerEvent) => {
            const start = touches.get(e.pointerId);
            if (!start) return;
            touches.delete(e.pointerId);
            const still = Math.hypot(e.clientX - start.x, e.clientY - start.y) < TAP_SLOP;
            // A beat later, so a tap that orders a new drink (on the click that follows) splashes in the new one
            if (still && e.timeStamp - start.at < TAP_TIME) {
                const { clientX, clientY } = e;
                window.setTimeout(() => splash(clientX, clientY), 0);
            }
        };
        const onCancel = (e: PointerEvent) => { touches.delete(e.pointerId); };

        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });
        window.addEventListener("pointercancel", onCancel, { passive: true });
        return () => {
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onCancel);
            layer.replaceChildren();
        };
    }, []);

    // Above everything, the intro included, so ordering a drink on a phone gets its splash too
    return <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-110 overflow-hidden" />;
}

export default CoffeeTouch;
