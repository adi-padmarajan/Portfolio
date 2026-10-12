import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import DrinkIcon from "./DrinkIcon";
import { useCoffeeOrder } from "../lib/coffeeOrder";

// Only where there's a real pointer to keep company, and only for visitors who are fine with motion
const COMPANION = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

// Where it sits relative to the arrow's tip: just below and to the right, clear of what's being pointed at
const OFFSET = { x: 18, y: 20 };

// What it grows a little over, and what it gets out of the way of: text fields (where the I-beam needs to be
// seen), the hero's cup and About's glass, which are the stars of their own sections, and the corner cup, which
// already shows the same drink
const INTERACTIVE = "a, button, [role='button'], label, summary, select";
const AVOID = "input, textarea, [contenteditable='true'], button[aria-label='Stir the coffee'], button[aria-label='Swirl the coffee'], button[aria-label^='Your order']";

// The visitor's drink, keeping their cursor company around the site. The real cursor is never replaced; the cup
// trails a moment behind it, leans into quick sideways moves, and swaps with a little pop when the order changes.
function CoffeeCursor(){
    const [enabled, setEnabled] = useState(() => window.matchMedia(COMPANION).matches);
    const drink = useCoffeeOrder();
    const cupRef = useRef<HTMLDivElement>(null);
    const firstDrink = useRef(true);

    useEffect(() => {
        const query = window.matchMedia(COMPANION);
        const onChange = () => setEnabled(query.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    useLayoutEffect(() => {
        const cup = cupRef.current;
        if (!enabled || !cup) return;

        gsap.set(cup, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.6 });
        const moveX = gsap.quickTo(cup, "x", { duration: 0.35, ease: "power3.out" });
        const moveY = gsap.quickTo(cup, "y", { duration: 0.35, ease: "power3.out" });
        const lean = gsap.quickTo(cup, "rotation", { duration: 0.5, ease: "power3.out" });
        let lastX: number | null = null;
        let state: "hidden" | "shown" | "grown" = "hidden";

        const become = (next: typeof state) => {
            if (next === state) return;
            state = next;
            gsap.to(cup, {
                autoAlpha: next === "hidden" ? 0 : 1,
                scale: next === "hidden" ? 0.6 : next === "grown" ? 1.3 : 1,
                duration: 0.3,
                ease: next === "hidden" ? "power2.in" : "back.out(2)",
                overwrite: "auto",
            });
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const x = e.clientX + OFFSET.x;
            const y = e.clientY + OFFSET.y;
            // On its first appearance, start where the cursor is rather than gliding in from the corner
            if (lastX === null) gsap.set(cup, { x, y });
            moveX(x);
            moveY(y);
            lean(gsap.utils.clamp(-14, 14, (e.clientX - (lastX ?? e.clientX)) * 0.6));
            lastX = e.clientX;

            const target = e.target instanceof Element ? e.target : null;
            if (target?.closest(AVOID)) become("hidden");
            else if (target?.closest(INTERACTIVE)) become("grown");
            else become("shown");
        };
        // Straighten up once the pointer comes to rest
        const settle = gsap.delayedCall(0.12, () => lean(0)).pause();
        const onMoveSettle = () => settle.restart(true);
        const onLeave = () => {
            become("hidden");
            lastX = null;
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointermove", onMoveSettle);
        document.documentElement.addEventListener("pointerleave", onLeave);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointermove", onMoveSettle);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            settle.kill();
            gsap.killTweensOf(cup);
        };
    }, [enabled]);

    // A new order arrives with a little pop
    useEffect(() => {
        if (firstDrink.current) {
            firstDrink.current = false;
            return;
        }
        const icon = cupRef.current?.firstElementChild;
        if (icon) gsap.fromTo(icon, { scale: 0.4, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" });
    }, [drink]);

    if (!enabled) return null;
    return(
        <div ref={cupRef} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-90 w-7 drop-shadow-[0_3px_6px_rgb(43_29_18/0.25)]">
            <DrinkIcon drink={drink} />
        </div>
    );
}

export default CoffeeCursor;
