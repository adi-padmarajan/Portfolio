import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DrinkIcon from "./DrinkIcon";
import DrinkPicker from "./DrinkPicker";
import { drinkName, setCoffeeOrder, useCoffeeOrder } from "../lib/coffeeOrder";
import type { DrinkId } from "../lib/coffeeOrder";
import { prefersReducedMotion } from "../lib/motion";
import { scrollToHash } from "../lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

// It never sits in the way: where there's no clear margin beside the content it steps aside while you read on and
// comes back as soon as you scroll up, and it bows out at the footer, which has its own way back to the top.
const WIDE = "(min-width: 1280px)";

// The visitor's order, in the corner: the drink they chose in the intro, emptying as they read down the page and
// filling again on the way back up. It turns up once they're past About (the hero and About each have their own
// coffee). Pressing it opens "Your order", to switch drinks or head back to the top.
function CoffeeProgress(){
    const popoverId = useId();
    const order = useCoffeeOrder();
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLSpanElement>(null);
    const surfaceRef = useRef<SVGCircleElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const progress = useRef(0);
    // Set when the menu was dismissed by pressing somewhere else, so focus can be put back once that press is done
    const closedOutside = useRef(false);
    const syncRef = useRef<() => void>(() => {});

    useLayoutEffect(() => {
        const root = rootRef.current!;
        const still = prefersReducedMotion();
        let shown = false;
        let atFooter = false;
        let readingOn = false;
        const wide = window.matchMedia(WIDE);
        gsap.set(root, { autoAlpha: 0, scale: 0.6, y: 12, transformOrigin: "100% 100%" });

        const show = (visible: boolean) => {
            if (visible === shown) return;
            shown = visible;
            const vars = { autoAlpha: visible ? 1 : 0, scale: visible ? 1 : 0.6, y: visible ? 0 : 12 };
            if (still) gsap.set(root, vars);
            else gsap.to(root, { ...vars, duration: visible ? 0.6 : 0.35, ease: visible ? "back.out(1.7)" : "power2.in", overwrite: true });
        };

        // The level follows the scroll exactly (no easing to lag behind), from full as Experience arrives to empty
        // at the bottom of the page. It's never hidden while its menu is open.
        const drain = () => gsap.set(surfaceRef.current, { scale: 1 - progress.current, svgOrigin: "50 50" });
        const sync = (self: ScrollTrigger) => {
            progress.current = self.progress;
            drain();
            show(openRef.current || (self.scroll() >= self.start && !atFooter && (wide.matches || !readingOn)));
        };
        const trigger = ScrollTrigger.create({
            trigger: "#experience",
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
        syncRef.current = () => sync(trigger);
        const onResize = () => sync(trigger);
        wide.addEventListener("change", onResize);

        return () => {
            trigger.kill();
            footer.kill();
            wide.removeEventListener("change", onResize);
        };
    }, []);

    // A new drink is a fresh cup at the same level, swapped in with a little wobble
    const firstOrder = useRef(true);
    useLayoutEffect(() => {
        syncRef.current();
        if (firstOrder.current) {
            firstOrder.current = false;
            return;
        }
        if (!prefersReducedMotion()) {
            gsap.fromTo(iconRef.current, { rotation: -14, scale: 0.85 }, { rotation: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        }
    }, [order]);

    // The menu opens over the cup with the current drink focused, and closes on a choice, Escape or a click
    // anywhere else, handing focus back to the cup
    useEffect(() => {
        openRef.current = open;
        syncRef.current();

        // A press elsewhere closes the menu and removes whatever had focus inside it. Once that press has given
        // focus to whatever it landed on (a link, a field), leave it there; if it landed on nothing focusable,
        // focus would be stranded on the page, so it goes back to the cup.
        if (!open && closedOutside.current) {
            closedOutside.current = false;
            const restore = window.setTimeout(() => {
                const active = document.activeElement;
                if (!active || active === document.body) buttonRef.current?.focus({ preventScroll: true });
            }, 0);
            return () => window.clearTimeout(restore);
        }

        const popover = popoverRef.current;
        if (!open || !popover) return;

        // Fade by opacity alone: a hidden element can't take focus, and the current drink needs it straight away
        if (!prefersReducedMotion()) {
            gsap.fromTo(popover, { opacity: 0, y: 8, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" });
        }
        menuRef.current?.querySelector<HTMLButtonElement>("[aria-pressed='true']")?.focus();

        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setOpen(false);
            buttonRef.current?.focus();
        };
        const onPointer = (e: PointerEvent) => {
            if (rootRef.current?.contains(e.target as Node)) return;
            closedOutside.current = true;
            setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointer);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointer);
        };
    }, [open]);

    const choose = (drink: DrinkId) => {
        setCoffeeOrder(drink);
        setOpen(false);
        buttonRef.current?.focus();
    };

    const name = drinkName(order);

    return(
        <div ref={rootRef} className="fixed right-4 bottom-4 z-30 sm:right-6 sm:bottom-6">
            {open && (
                <div
                    ref={popoverRef}
                    id={popoverId}
                    role="dialog"
                    aria-label="Your order"
                    className="absolute right-0 bottom-full mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_12px_40px_rgb(0_0_0/0.12)]"
                >
                    <p className="text-[0.625rem] font-medium tracking-widest text-gray-400 uppercase">Your order</p>
                    <div className="mt-3">
                        <DrinkPicker listRef={menuRef} size="compact" label="Change your coffee" value={order} onChoose={choose} />
                    </div>
                    <div className="mt-3 border-t border-gray-100 pt-3">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                scrollToHash("#top");
                            }}
                            className="group flex w-full cursor-pointer items-center justify-between rounded-lg px-1 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-black"
                        >
                            Back to top
                            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
                        </button>
                    </div>
                </div>
            )}

            <button
                ref={buttonRef}
                type="button"
                aria-label={`Your order: ${name}. Change it, or go back to the top`}
                title={`Your order: ${name}`}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? popoverId : undefined}
                onClick={() => setOpen((value) => !value)}
                className="block h-12 w-12 cursor-pointer rounded-full transition-[translate] duration-300 hover:-translate-y-1 sm:h-14 sm:w-14 focus-visible:outline-[#2a170c]"
            >
                <span ref={iconRef} className="block h-full w-full drop-shadow-[0_4px_10px_rgb(43_29_18/0.18)]">
                    <DrinkIcon drink={order} surfaceRef={surfaceRef} className="h-full w-full" />
                </span>
            </button>
        </div>
    );
}

export default CoffeeProgress;
