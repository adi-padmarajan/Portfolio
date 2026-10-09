import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { GREETING_TEXT } from "./greetingText";
import HeroDetail from "./HeroDetail";
import LocalTime from "./LocalTime";
import ScrollCue from "./ScrollCue";
import { MOTION_OK } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

// The subtitle cycles through these, starting with the first
const ROLES = ["Software Developer", "Marathon Runner"];

type HeroTitleProps = {
    // True while the intro overlay is still on screen
    introActive: boolean;
};

function HeroTitle({ introActive }: HeroTitleProps){
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const roleRef = useRef<HTMLSpanElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    // Whether this visit started with the intro; read once on mount
    const [followsIntro] = useState(introActive);

    // Entrance. The details enter item by item, while scrolling away fades their shared container,
    // so the two animations never fight over the same element
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const details = detailsRef.current?.children ?? [];

            // Keep the subtitle and details hidden while the overlay slides away, so they can enter once the page is clear
            if (introActive) {
                gsap.set([subtitleRef.current, details], { autoAlpha: 0 });
                return;
            }

            // Swap roles with a brief scramble, holding each one long enough to read
            const cycle = gsap.timeline({ paused: true, repeat: -1 });
            ROLES.forEach((_, i) => {
                cycle.to(roleRef.current, {
                    duration: 1,
                    ease: "none",
                    scrambleText: {
                        text: ROLES[(i + 1) % ROLES.length],
                        chars: "lowerCase",
                        speed: 0.6,
                    },
                }, "+=2.8");
            });

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            let split: SplitText | undefined;
            // After the intro, the overlay sliding off is the name's entrance, so only the rest animates.
            // Otherwise each letter rises out of a mask, one after another.
            if (!followsIntro) {
                split = SplitText.create(titleRef.current, { type: "words,chars", mask: "words" });
                tl.from(split.chars, {
                    yPercent: 110,
                    duration: 1.1,
                    ease: "power4.out",
                    stagger: 0.045,
                });
            }
            tl.fromTo(subtitleRef.current, {
                y: 20,
                autoAlpha: 0,
            }, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
            }, followsIntro ? 0 : "-=0.6")
              .fromTo(details, {
                y: 12,
                autoAlpha: 0,
            }, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.1,
            }, "-=0.5")
              .add(() => { cycle.play(); });

            return () => split?.revert();
        });
        return () => mm.revert();
    }, [introActive, followsIntro]);

    // Scrolling away: the hero holds still while About rises over it, and the name drifts forward into a blur,
    // like a cut between scenes
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                },
            })
              .to(detailsRef.current, { autoAlpha: 0, duration: 0.2 }, 0)
              // About reaches the middle of the screen halfway through, so the name is gone by then
              .to(stageRef.current, {
                scale: 1.12,
                filter: "blur(12px)",
                autoAlpha: 0,
                duration: 0.5,
            }, 0)
              // Hold the pin until About covers the hero completely
              .to({}, { duration: 0.5 });
        });
        return () => mm.revert();
    }, []);

    // The subtitle hangs below the name, out of flow, so the name is centred exactly where the intro's "Hello" was.
    // Screen readers get every role at once instead of the changing text.
    return (
    <section ref={sectionRef} className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-white px-4 text-center">
        <div ref={stageRef} className="relative">
            <h1 ref={titleRef} className={GREETING_TEXT}>
                I am Adi
            </h1>
            <p ref={subtitleRef} className="absolute top-full left-1/2 mt-4 -translate-x-1/2 whitespace-nowrap text-xl font-medium tracking-wide text-gray-500 sm:mt-6 sm:text-3xl">
                <span className="sr-only">{ROLES.join(" and ")}</span>
                <span ref={roleRef} aria-hidden="true">{ROLES[0]}</span>
            </p>
        </div>

        {/* Details framing the bottom edge, like the credits on a film still */}
        <div
            ref={detailsRef}
            className="absolute inset-x-0 bottom-0 grid grid-cols-2 items-end gap-6 px-6 pb-8 text-left sm:grid-cols-3 md:px-10 md:pb-10 lg:px-12"
        >
            <HeroDetail label="Based in">
                Vancouver, Canada · <span className="whitespace-nowrap"><LocalTime /></span>
            </HeroDetail>
            <div className="justify-self-end sm:justify-self-center">
                <ScrollCue />
            </div>
            <div className="hidden justify-self-end text-right sm:block">
                <HeroDetail label="Currently">
                    Software Developer at STEMCELL
                </HeroDetail>
            </div>
        </div>
    </section>
    );
}

export default HeroTitle;
