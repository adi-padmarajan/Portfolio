import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import DrinkPicker from "../components/DrinkPicker";
import { GREETINGS as greetings, GREETING_TEXT } from "../components/greetingText";
import { getCoffeeOrder, setCoffeeOrder, useCoffeeOrder } from "../lib/coffeeOrder";
import type { DrinkId } from "../lib/coffeeOrder";
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
// and asks how they take their coffee. Ordering a drink is how they come in: it's served, the overlay lifts, and
// their drink keeps them company for the rest of the visit. Anyone just looking gets what I drink.
function Languages({ onReveal, onComplete }: LanguagesProps){
    const overlayRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<HTMLSpanElement[]>([]);
    const introRef = useRef<HTMLDivElement>(null);
    const helloRef = useRef<HTMLSpanElement>(null);
    const restRefs = useRef<HTMLSpanElement[]>([]);
    const orderRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    // Set once the introduction has landed; serves the chosen drink and lifts the overlay
    const exitRef = useRef<((drink: DrinkId) => void) | null>(null);
    const order = useCoffeeOrder();

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
              // Then the question, and the menu set out one cup at a time
              .set(orderRef.current, { autoAlpha: 1 }, "-=0.3")
              .from(orderRef.current!.querySelector("[data-question]"), { y: 16, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, "<")
              .from(menuRef.current!.children, { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "back.out(1.6)" }, "-=0.4")
              .from(orderRef.current!.querySelector("[data-skip]"), { autoAlpha: 0, duration: 0.6 }, "-=0.2")
              .add(() => { exitRef.current = exit; });

            // Serve the order: the other cups step back, the chosen one slides to the middle and is lifted
            // towards you, and then the overlay rises
            function exit(drink: DrinkId){
                exitRef.current = null;
                setCoffeeOrder(drink);
                const items = gsap.utils.toArray<HTMLElement>(menuRef.current!.children);
                const chosen = items.find((item) => item.dataset.drink === drink) ?? items[0];
                const menu = menuRef.current!.getBoundingClientRect();
                const cup = chosen.getBoundingClientRect();
                gsap.timeline()
                  .to(items.filter((item) => item !== chosen), { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: "power2.in" })
                  .to(orderRef.current!.querySelectorAll("[data-question], [data-skip]"), { autoAlpha: 0, duration: 0.3 }, 0)
                  .to(chosen, {
                    x: menu.left + menu.width / 2 - (cup.left + cup.width / 2),
                    y: -12,
                    scale: 1.35,
                    duration: 0.7,
                    ease: "power3.inOut",
                }, 0.15)
                  .to(introRef.current, { y: -40, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, "+=0.35")
                  .add(onReveal, "-=0.2")
                  .to(overlayRef.current, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "<")
                  .add(onComplete);
            }
        });

        // Enter, before anything's been picked, orders the usual
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Enter" && e.target === document.body) exitRef.current?.(getCoffeeOrder());
        };
        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
            ctx.revert();
            unlockScroll();
        };
    }, [onReveal, onComplete]);

    // If a screen is ever too short for the whole scene, the overlay scrolls rather than cutting the order off
    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Introduction"
            data-lenis-prevent
            className="fixed inset-0 z-100 overflow-y-auto overscroll-contain bg-white"
        >
            <div className="grid min-h-full place-items-center px-6 py-10 short:py-4">
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
                    <div ref={orderRef} className="invisible mt-10 flex flex-col items-center sm:mt-16 short:mt-4">
                        <p data-question className="text-base font-medium tracking-tight text-gray-500 sm:text-xl short:text-base">
                            How do you take your coffee?
                        </p>
                        <div className="mt-6 sm:mt-8 short:mt-2">
                            <DrinkPicker
                                listRef={menuRef}
                                label="Choose your coffee"
                                value={order}
                                onChoose={(drink) => exitRef.current?.(drink)}
                            />
                        </div>
                        <button
                            data-skip
                            type="button"
                            onClick={() => exitRef.current?.(getCoffeeOrder())}
                            className="group mt-6 inline-flex cursor-pointer items-center gap-2 py-2 text-xs font-medium tracking-widest text-gray-400 uppercase transition-colors hover:text-black sm:mt-8 short:mt-1"
                        >
                            Just looking
                            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Languages;
