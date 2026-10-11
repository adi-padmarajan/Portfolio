import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import CircleButton from "../components/CircleButton";
import { GREETINGS as greetings, GREETING_TEXT } from "../components/greetingText";
import { lockScroll, unlockScroll } from "../lib/smoothScroll";

type LanguagesProps = {
    // Called when the overlay starts sliding away, so the site can mount underneath
    onReveal: () => void;
    // Called once the overlay is fully off screen
    onComplete: () => void;
};

// The words that finish the greeting's sentence, each sliding up out of its own mask
const REST = [",", "I’m", "Adi."];

// The opening scene: "hello" in the languages around me, then the greeting finishes its thought ("Hello, I'm Adi.")
// and the visitor chooses when to begin. The overlay only lifts once they press Begin.
function Languages({ onReveal, onComplete }: LanguagesProps){
    const overlayRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<HTMLSpanElement[]>([]);
    const introRef = useRef<HTMLDivElement>(null);
    const helloRef = useRef<HTMLSpanElement>(null);
    const restRefs = useRef<HTMLSpanElement[]>([]);
    const beginRef = useRef<HTMLDivElement>(null);
    // Set once the introduction has landed; lifts the overlay
    const exitRef = useRef<(() => void) | null>(null);

    useLayoutEffect(() => {
        lockScroll();

        const ctx = gsap.context(() => {
            const words = wordRefs.current;
            const greetingHello = words[words.length - 1];
            const tl = gsap.timeline();

            gsap.set(words, { autoAlpha: 0 });
            gsap.set(restRefs.current, { yPercent: 110 });

            // Fade the first greeting in, then swap through the rest
            tl.fromTo(words[0], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" });
            for (let i = 1; i < words.length; i++) {
                tl.set(words[i - 1], { autoAlpha: 0 }, i === 1 ? "+=0.35" : "+=0.2")
                  .set(words[i], { autoAlpha: 1 }, "<");
            }

            // Swap the lone "Hello" for the sentence's, starting exactly where the greeting sat, then let it glide
            // into place as the rest of the sentence rises in beside it
            const fromGreeting = () => {
                const from = greetingHello.getBoundingClientRect();
                const to = helloRef.current!.getBoundingClientRect();
                return { x: from.left - to.left, y: from.top - to.top, scale: from.height / to.height };
            };
            tl.add(() => {
                gsap.set(helloRef.current, { ...fromGreeting(), transformOrigin: "0 0" });
                gsap.set(greetingHello, { autoAlpha: 0 });
                gsap.set(introRef.current, { autoAlpha: 1 });
            }, "+=0.8")
              .to(helloRef.current, { x: 0, y: 0, scale: 1, duration: 1.1, ease: "power4.inOut" })
              .to(restRefs.current, { yPercent: 0, duration: 1, stagger: 0.12, ease: "power4.out" }, "-=0.55")
              // Then the invitation to begin; Enter works too
              .fromTo(beginRef.current, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)" }, "-=0.4")
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

                <div ref={introRef} className="invisible flex flex-col items-center text-center [grid-area:1/1]">
                    {/* On phones the sentence breaks after the comma, so it stays at the greetings' size.
                        Each mask has a little room below, so descenders and the full stop aren't clipped. */}
                    <p className={GREETING_TEXT}>
                        <span className="sr-only">Hello, I’m Adi.</span>
                        <span aria-hidden="true">
                            <span ref={helloRef} className="inline-block">Hello</span>
                            {REST.map((word, i) => (
                                <span key={word}>
                                    {i > 0 && " "}
                                    {i === 1 && <br className="sm:hidden" />}
                                    <span className="mb-[-0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
                                        <span
                                            ref={(el) => { if (el) restRefs.current[i] = el; }}
                                            className="block"
                                        >
                                            {word}
                                        </span>
                                    </span>
                                </span>
                            ))}
                        </span>
                    </p>
                    <div ref={beginRef} className="invisible mt-14 sm:mt-20">
                        <CircleButton onClick={() => exitRef.current?.()}>Begin</CircleButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Languages;
