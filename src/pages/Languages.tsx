import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { GREETINGS as greetings, GREETING_TEXT } from "../components/greetingText";
import Wordmark from "../components/Wordmark";
import { WORDMARK_HEIGHT } from "../components/wordmarkGeometry";
import { lockScroll, unlockScroll } from "../lib/smoothScroll";

type LanguagesProps = {
    // Called when the overlay starts sliding away, so the site can mount underneath
    onReveal: () => void;
    // Called once the overlay is fully off screen
    onComplete: () => void;
};

// The opening scene: "hello" in the languages around me, then an introduction ("I am Adi"), and the visitor
// chooses when to step into the story. The overlay only lifts once they press Continue.
function Languages({ onReveal, onComplete }: LanguagesProps){
    const overlayRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<HTMLSpanElement[]>([]);
    const introRef = useRef<HTMLDivElement>(null);
    const leadRef = useRef<HTMLSpanElement>(null);
    const lettersRef = useRef<SVGGElement>(null);
    const continueRef = useRef<HTMLButtonElement>(null);
    // Set once the introduction has landed; lifts the overlay
    const exitRef = useRef<(() => void) | null>(null);

    useLayoutEffect(() => {
        lockScroll();

        const ctx = gsap.context(() => {
            const words = wordRefs.current;
            const hello = words[words.length - 1];
            const tl = gsap.timeline();

            gsap.set(words, { autoAlpha: 0 });

            // Fade the first greeting in, then swap through the rest
            tl.fromTo(words[0], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" });
            for (let i = 1; i < words.length; i++) {
                tl.set(words[i - 1], { autoAlpha: 0 }, i === 1 ? "+=0.35" : "+=0.2")
                  .set(words[i], { autoAlpha: 1 }, "<");
            }

            // "Hello" lifts away as the introduction rises in beneath it, using the hero's entrance:
            // the letters rise out of the wordmark's edge one after another, and "I am" slides out of its mask
            tl.to(hello, { yPercent: -60, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, "+=0.7")
              .set(introRef.current, { autoAlpha: 1 })
              .from(lettersRef.current?.children ?? [], {
                y: WORDMARK_HEIGHT * 1.1,
                duration: 1.3,
                stagger: 0.09,
                ease: "power4.out",
            })
              .from(leadRef.current?.firstElementChild ?? [], { yPercent: 110, duration: 1, ease: "power4.out" }, "-=1.1")
              // Then the invitation to carry on; Enter works too, without a focus ring sitting on the button
              .fromTo(continueRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
              .add(() => { exitRef.current = exit; });

            function exit(){
                exitRef.current = null;
                gsap.timeline()
                  .to(introRef.current, { y: -40, autoAlpha: 0, duration: 0.6, ease: "power3.in" })
                  .add(onReveal, "-=0.2")
                  .to(overlayRef.current, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "<")
                  .add(onComplete);
            }
        });

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Enter" && e.target === document.body) exitRef.current?.();
        };
        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
            ctx.revert();
            unlockScroll();
        };
    }, [onReveal, onComplete]);

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Introduction"
            className="fixed inset-0 z-100 grid place-items-center bg-white px-6"
        >
            <div className="grid place-items-center">
                <div aria-hidden="true" className="grid place-items-center [grid-area:1/1]">
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

                {/* Sized like the hero, so the introduction reads as the same name the site opens on */}
                <div ref={introRef} className="invisible flex flex-col items-center text-center [grid-area:1/1]">
                    <p>
                        <span className="sr-only">Hello, I am Adi</span>
                        <span ref={leadRef} aria-hidden="true" className="block overflow-hidden text-2xl font-medium tracking-tight text-gray-500 sm:text-3xl lg:text-4xl">
                            <span className="block">I am</span>
                        </span>
                        <span aria-hidden="true" className="mx-auto mt-6 block w-[min(68vw,calc(27svh*1.9),36rem)] text-black sm:mt-8 lg:mt-10">
                            <Wordmark letterRef={lettersRef} />
                        </span>
                    </p>
                    <button
                        ref={continueRef}
                        type="button"
                        onClick={() => exitRef.current?.()}
                        className="group invisible mt-12 inline-flex items-center gap-3 rounded-full border border-black/15 px-7 py-3 text-xs font-medium tracking-widest text-black uppercase transition-colors duration-300 hover:border-black hover:bg-black hover:text-white sm:mt-16 sm:text-sm"
                    >
                        Continue
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Languages;
