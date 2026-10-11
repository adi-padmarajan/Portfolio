import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CupsToday from "./CupsToday";
import { MOTION_OK } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

// The facts, set out like a coffee shop's menu board. A value marked with data-count counts up from zero.
const ITEMS: { label: string; value: ReactNode }[] = [
    { label: "Full marathons", value: <span data-count="6">6</span> },
    { label: "Race distance", value: <><span data-count="42.2" data-decimals="1">42.2</span> km</> },
    { label: "Cups of coffee today", value: <CupsToday /> },
    { label: "Education", value: "BSc Computer Science, UVic" },
];

// Each row runs a dotted leader from its label to its value, the way menu prices line up. As the board scrolls
// into view the rows settle in one by one, the leaders draw across and the numbers count up.
function CafeMenu(){
    const menuRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia(menuRef);
        mm.add(MOTION_OK, () => {
            const menu = menuRef.current!;
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: menu, start: "top 85%" },
            })
              .from(menu.querySelectorAll("[data-row]"), { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.1 })
              .from(menu.querySelectorAll("[data-leader]"), { scaleX: 0, duration: 1, stagger: 0.1, ease: "power3.inOut" }, 0.1);

            // Count up by rewriting the number's own text node, so React still owns it for later updates
            menu.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
                const text = el.firstChild;
                const target = Number(el.dataset.count);
                const decimals = Number(el.dataset.decimals ?? 0);
                if (!text || !target) return;
                const counter = { value: 0 };
                text.nodeValue = (0).toFixed(decimals);
                tl.to(counter, {
                    value: target,
                    duration: 1.4,
                    ease: "power2.out",
                    onUpdate: () => { text.nodeValue = counter.value.toFixed(decimals); },
                    onComplete: () => { text.nodeValue = target.toFixed(decimals); },
                }, 0.3);
            });

            return () => {
                menu.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
                    if (el.firstChild) el.firstChild.nodeValue = Number(el.dataset.count).toFixed(Number(el.dataset.decimals ?? 0));
                });
            };
        });
        return () => mm.revert();
    }, []);

    return(
        <div ref={menuRef}>
            <h3 className="text-xs font-medium tracking-widest text-[#8c7a6b] uppercase">The menu</h3>
            <dl className="mt-5 space-y-4 sm:mt-6">
                {ITEMS.map((item) => (
                    <div key={item.label} data-row className="flex items-baseline gap-3 text-base text-[#2a170c] sm:text-lg">
                        <dt className="shrink-0">{item.label}</dt>
                        <span
                            data-leader
                            aria-hidden="true"
                            className="min-w-6 flex-1 origin-left -translate-y-[0.3em] border-b-2 border-dotted border-[#2a170c]/20"
                        />
                        <dd className="text-right font-medium tabular-nums">{item.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export default CafeMenu;
