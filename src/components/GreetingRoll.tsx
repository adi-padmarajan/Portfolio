import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "../lib/motion";
import { GREETINGS } from "./greetingText";

gsap.registerPlugin(ScrollTrigger);

// Start on English, then carry on through the rest in the intro's order
const WORDS = [GREETINGS[GREETINGS.length - 1], ...GREETINGS.slice(0, -1)];

// How far (as a percentage of a word's height) the waiting words sit below the mask: enough to clear its padding
const OFFSET = 160;

// "Hello" rolling through the intro's languages, each word sliding up out of a mask as the next slides in.
// Purely visual: the headline around it gives screen readers a plain "hello". Without motion it simply reads "Hello".
function GreetingRoll(){
    const rollRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const roll = rollRef.current;
        if (!roll) return;

        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const words = gsap.utils.toArray<HTMLElement>(roll.children);
            gsap.set(words, { y: 0, yPercent: (i) => (i ? OFFSET : 0) });

            // Only roll while the headline is on screen
            const tl = gsap.timeline({
                repeat: -1,
                defaults: { duration: 0.8, ease: "power4.inOut" },
                scrollTrigger: {
                    trigger: roll,
                    start: "top bottom",
                    end: "bottom top",
                    toggleActions: "play pause resume pause",
                },
            });
            words.forEach((word, i) => {
                const next = words[(i + 1) % words.length];
                tl.to(word, { yPercent: -OFFSET }, "+=1.6")
                  .fromTo(next, { yPercent: OFFSET }, { yPercent: 0 }, "<");
            });
        });
        return () => mm.revert();
    }, []);

    // The words share one grid cell, so the mask is as wide as the widest. Extra padding inside the mask gives
    // scripts with tall marks (Hindi, Malayalam) room, and the matching negative margin keeps the line height.
    return(
        <span ref={rollRef} className="-my-[0.2em] inline-grid overflow-hidden py-[0.2em] align-bottom">
            {WORDS.map((word, i) => (
                <span
                    key={word.lang}
                    lang={word.lang}
                    className="whitespace-nowrap [grid-area:1/1]"
                    style={i ? { transform: `translateY(${OFFSET}%)` } : undefined}
                >
                    {word.text}
                </span>
            ))}
        </span>
    );
}

export default GreetingRoll;
