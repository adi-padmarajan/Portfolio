import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CupsToday from "./CupsToday";
import { MOTION_OK } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

// A few numbers that say more than a paragraph could. A value marked with data-count counts up from zero.
const FACTS: { label: string; value: ReactNode }[] = [
    { label: "Full marathons", value: <span data-count="6">6</span> },
    { label: "Race distance", value: <><span data-count="42.2" data-decimals="1">42.2</span><span className="ml-1 text-[0.5em] tracking-normal">km</span></> },
    { label: "Cups of coffee today", value: <CupsToday /> },
];

// Set like the hero's credits, scaled up: a big black figure over a small grey label. As the row scrolls into
// view the figures rise in one by one and count up.
function AboutFacts(){
    const factsRef = useRef<HTMLDListElement>(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia(factsRef);
        mm.add(MOTION_OK, () => {
            const facts = factsRef.current!;
            const tl = gsap.timeline({ scrollTrigger: { trigger: facts, start: "top 85%" } })
              .from(facts.children, { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" });

            // Count up by rewriting the figure's own text node, so React still owns it for later updates
            const counters = facts.querySelectorAll<HTMLElement>("[data-count]");
            counters.forEach((el) => {
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
                }, 0.2);
            });

            return () => counters.forEach((el) => {
                if (el.firstChild) el.firstChild.nodeValue = Number(el.dataset.count).toFixed(Number(el.dataset.decimals ?? 0));
            });
        });
        return () => mm.revert();
    }, []);

    return(
        <dl ref={factsRef} className="grid grid-cols-[repeat(3,auto)] justify-between gap-x-5 sm:gap-x-8">
            {FACTS.map((fact) => (
                <div key={fact.label} className="flex flex-col-reverse justify-end gap-2 sm:gap-3">
                    <dt className="text-[0.625rem] font-medium tracking-widest text-gray-400 uppercase sm:text-xs">{fact.label}</dt>
                    <dd className="text-[2rem] leading-none font-extrabold tracking-tighter whitespace-nowrap text-black tabular-nums sm:text-5xl lg:text-6xl">{fact.value}</dd>
                </div>
            ))}
        </dl>
    );
}

export default AboutFacts;
