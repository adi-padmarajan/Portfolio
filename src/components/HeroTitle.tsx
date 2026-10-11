import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CoffeeCup from "./CoffeeCup";
import HeroDetail from "./HeroDetail";
import LocalTime from "./LocalTime";
import ScrollCue from "./ScrollCue";
import { MOTION_OK } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Who I am, in three words
const ROLES = ["Software Engineer.", "Marathoner.", "Builder."];

type HeroTitleProps = {
    // True while the intro overlay is still on screen
    introActive: boolean;
};

// The intro has already said my name, so the hero opens the story with what drives it (and what fuels it)
function HeroTitle({ introActive }: HeroTitleProps){
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const rolesRef = useRef<HTMLParagraphElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLSpanElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    const cupRef = useRef<HTMLDivElement>(null);
    // The site mounts as the intro overlay starts sliding away, so this is read once, on mount
    const [followsIntro] = useState(introActive);

    // The cup sets down while the headline rises, and its coffee pours once the line has drawn out
    const entranceDelay = followsIntro ? 0.45 : 0.15;

    // Entrance: the roles tick in one by one, the headline rises line by line out of its masks, and the
    // line with no finish draws out towards the edge of the screen. Each mask is left free for the scroll animation.
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            // After the intro, start while the overlay is still lifting, so the words rise into the space it uncovers
            gsap.timeline({ delay: entranceDelay, defaults: { ease: "power4.out" } })
              .from(rolesRef.current?.children ?? [], { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" })
              .from(headlineRef.current?.querySelectorAll("[data-line]") ?? [], { yPercent: 110, duration: 1.2, stagger: 0.12 }, "-=0.5")
              .from(lineRef.current, { scaleX: 0, duration: 1.4, ease: "power3.inOut" }, "-=0.6")
              .from(taglineRef.current, { y: 20, autoAlpha: 0, duration: 1, ease: "power3.out" }, "-=1.1")
              .from(cupRef.current, { scale: 0.92, autoAlpha: 0, duration: 1.4, ease: "power3.out" }, 0.5)
              .from(detailsRef.current?.children ?? [], {
                y: 12,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
            }, "-=0.6");
        });
        return () => mm.revert();
    }, [entranceDelay]);

    // Scrolling: the words drift up and fade a little faster than the page, so the hero gives way to About,
    // while the cup lags behind them and turns on its saucer
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            })
              .to(contentRef.current, { yPercent: -25, autoAlpha: 0 }, 0)
              .to(detailsRef.current, { autoAlpha: 0, duration: 0.4 }, 0)
              .to(cupRef.current, { yPercent: -10, rotate: 20, autoAlpha: 0 }, 0);
        });
        return () => mm.revert();
    }, []);

    // Left-aligned like the opening page of a book. The line after the headline runs off the right edge
    // (it borrows the section's padding), with a short segment forever travelling along it.
    return (
    <section ref={sectionRef} className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-white px-6 pt-24 pb-40 md:px-10 lg:px-12">
        <div ref={contentRef}>
            <p ref={rolesRef} className="flex flex-wrap gap-x-2.5 text-[0.625rem] font-medium tracking-widest text-gray-400 uppercase sm:gap-x-4 sm:text-sm">
                {ROLES.map((role) => <span key={role}>{role}</span>)}
            </p>

            <h1 ref={headlineRef} className="mt-6 text-[clamp(2.5rem,8.5vw,7.5rem)] leading-[0.95] font-extrabold tracking-tighter text-black sm:mt-8">
                <span className="block overflow-hidden pb-[0.08em]">
                    <span data-line className="block">Curiosity without</span>
                </span>
                <span className="-mr-6 flex items-center gap-4 md:-mr-10 lg:-mr-12 sm:gap-6">
                    <span className="overflow-hidden pb-[0.08em] whitespace-nowrap">
                        <span data-line className="block">a finish line.</span>
                    </span>
                    <span
                        ref={lineRef}
                        aria-hidden="true"
                        className="relative block h-px min-w-8 flex-1 origin-left overflow-hidden bg-black/15"
                    >
                        <span className="absolute inset-y-0 left-0 block w-1/4 bg-black motion-safe:animate-finish-line" />
                    </span>
                </span>
            </h1>

            <p ref={taglineRef} className="mt-8 text-xl font-medium tracking-tight text-gray-500 sm:mt-10 sm:text-2xl lg:text-3xl">
                Building ideas. Chasing challenges. <span className="sm:block">Always moving forward.</span>
            </p>
        </div>

        {/* Under the words on smaller screens; on large ones it fills the right half, sitting above the headline's
            line so the line passes behind the saucer and carries on out the other side */}
        <div
            ref={cupRef}
            className="mt-10 w-44 self-end sm:w-56 lg:absolute lg:top-1/2 lg:right-12 lg:mt-0 lg:w-[min(30vw,28rem,58svh)] lg:-translate-y-[55%]"
        >
            <CoffeeCup delay={entranceDelay + 2} />
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
                    Software Developer at STEMCELL Technologies
                </HeroDetail>
            </div>
        </div>
    </section>
    );
}

export default HeroTitle;
