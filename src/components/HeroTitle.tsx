import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GREETING_TEXT } from "./greetingText";

type HeroTitleProps = {
    // True while the intro overlay is still on screen
    introActive: boolean;
};

function HeroTitle({ introActive }: HeroTitleProps){
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    // Whether this visit started with the intro; read once on mount
    const [followsIntro] = useState(introActive);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Keep the subtitle hidden while the overlay slides away, so it can enter once the page is clear
            if (introActive) {
                gsap.set(subtitleRef.current, { autoAlpha: 0 });
                return;
            }

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            // After the intro, the overlay sliding off is the name's entrance, so only the subtitle animates
            if (!followsIntro) {
                tl.from(titleRef.current, {
                    y: 40,
                    opacity: 0,
                    duration: 1,
                });
            }
            tl.fromTo(subtitleRef.current, {
                y: 20,
                autoAlpha: 0,
            }, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
            }, followsIntro ? 0 : "-=0.5");
        });
        return () => ctx.revert();
    }, [introActive, followsIntro]);

    // The subtitle hangs below the name, out of flow, so the name is centred exactly where the intro's "Hello" was
    return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-white px-4 text-center">
        <div className="relative">
            <h1 ref={titleRef} className={GREETING_TEXT}>
                I am Adi
            </h1>
            <p ref={subtitleRef} className="absolute top-full left-1/2 mt-4 -translate-x-1/2 whitespace-nowrap text-xl font-medium tracking-wide text-gray-500 sm:mt-6 sm:text-3xl">
                Software Developer
            </p>
        </div>
    </section>
    );
}

export default HeroTitle;
