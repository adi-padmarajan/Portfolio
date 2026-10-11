import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { GREETINGS as greetings, GREETING_TEXT } from "../components/greetingText";
import { lockScroll, unlockScroll } from "../lib/smoothScroll";

type LanguagesProps = {
    // Called when the overlay starts sliding away, so the site can mount underneath
    onReveal: () => void;
    // Called once the overlay is fully off screen
    onComplete: () => void;
};

function Languages({ onReveal, onComplete }: LanguagesProps){
    const overlayRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<HTMLSpanElement[]>([]);

    useLayoutEffect(() => {
        lockScroll();

        const ctx = gsap.context(() => {
            const words = wordRefs.current;
            const tl = gsap.timeline();

            gsap.set(words, { autoAlpha: 0 });

            // Fade the first greeting in, then swap through the rest
            tl.fromTo(words[0], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" });
            for (let i = 1; i < words.length; i++) {
                tl.set(words[i - 1], { autoAlpha: 0 }, i === 1 ? "+=0.35" : "+=0.2")
                  .set(words[i], { autoAlpha: 1 }, "<");
            }

            tl.add(onReveal, "+=0.6")
              .to(overlayRef.current, { yPercent: -100, duration: 1, ease: "power4.inOut" })
              .add(onComplete);
        });

        return () => {
            ctx.revert();
            unlockScroll();
        };
    }, [onReveal, onComplete]);

    return (
        <div
            ref={overlayRef}
            role="status"
            aria-label="Hello"
            className="fixed inset-0 z-100 grid place-items-center bg-white px-4"
        >
            <div aria-hidden="true" className="grid place-items-center">
                {greetings.map((greeting, i) => (
                    <span
                        key={greeting.lang}
                        ref={(el) => { if (el) wordRefs.current[i] = el; }}
                        lang={greeting.lang}
                        className={`invisible [grid-area:1/1] ${GREETING_TEXT}`}
                    >
                        {greeting.text}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Languages;
