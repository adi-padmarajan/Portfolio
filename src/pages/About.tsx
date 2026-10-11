import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MOTION_OK } from "../lib/motion";
import { AboutTitle, CafeMenu, CircleButton, CoffeeRing } from "../components";

gsap.registerPlugin(ScrollTrigger, SplitText);

// The second stop on the coffee journey: the hero hands you a cup, and here you sit down with it. The page warms
// to café cream, the statement is written in espresso, and the cup from the hero has left its ring on the paper.
function About(){
    const sectionRef = useRef<HTMLDivElement>(null);
    const statementRef = useRef<HTMLParagraphElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const ruleRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia(sectionRef);
        mm.add(MOTION_OK, () => {
            // The statement lights up word by word as it rises into view, so it's read at the pace of the scroll.
            // Unlit words stay faintly visible, so the sentence is never hidden from anyone reading ahead.
            const split = SplitText.create(statementRef.current, { type: "words" });
            gsap.fromTo(split.words, { opacity: 0.15 }, {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: statementRef.current,
                    start: "top 80%",
                    end: "bottom 50%",
                    scrub: true,
                },
            });

            // The ring is set down on the page as the statement arrives (pressing in slightly, as a mug would),
            // then drifts a touch slower than the words as you read on
            gsap.from(ringRef.current, {
                scale: 1.06,
                rotate: -8,
                autoAlpha: 0,
                duration: 1.4,
                ease: "power3.out",
                scrollTrigger: { trigger: statementRef.current, start: "top 85%" },
            });
            gsap.to(ringRef.current, {
                yPercent: 18,
                ease: "none",
                scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
            });

            // The rule draws across, the button settles onto it, then the details below follow
            gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: ruleRef.current,
                    start: "top 85%",
                },
            })
              .from(ruleRef.current, { scaleX: 0, duration: 1.2, ease: "power4.inOut" })
              .from(buttonRef.current, { scale: 0.6, autoAlpha: 0, duration: 0.9, ease: "back.out(1.6)" }, "-=0.5")
              .from(detailsRef.current?.firstElementChild ?? [], { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.6");

            return () => split.revert();
        });
        return () => mm.revert();
    }, []);

    // The cream fades in from the hero's white and back out to white before Experience, so the café is a
    // warm room you pass through rather than a hard band. The same structure as Contact, so the two sections
    // read as one system: a statement, a rule with the round button resting on it, and the details beneath.
    return(
        <div
            ref={sectionRef}
            className="relative overflow-hidden bg-[linear-gradient(to_bottom,#ffffff,#faf6f0_20svh,#faf6f0_calc(100%-20svh),#ffffff)]"
        >
            <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pt-32 pb-32 sm:pt-40 sm:pb-40 md:px-10 lg:px-12">
                <CoffeeRing
                    ringRef={ringRef}
                    className="absolute top-14 -right-24 w-48 opacity-45 sm:top-16 sm:-right-20 sm:w-72 lg:-right-28 lg:w-80"
                />

                <AboutTitle />

                {/* The lead phrase carries the statement in espresso; the rest recedes into a warm grey */}
                <p
                    ref={statementRef}
                    className="relative mt-8 max-w-5xl text-3xl leading-[1.15] font-medium tracking-tight text-[#9a8878] sm:mt-10 sm:text-5xl lg:text-6xl lg:leading-[1.1]"
                >
                    <span className="text-[#1f1008]">I have always been drawn to a&nbsp;challenge,</span>{" "}
                    whether it's turning ambitious ideas into something real or pushing my limits across 42.2 kilometres.
                </p>

                {/* The button straddles the rule, as if it were resting on it */}
                <div className="relative mt-20 sm:mt-28">
                    <div ref={ruleRef} className="h-px origin-left bg-[#2a170c]/15" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 sm:right-12 lg:right-24">
                        <div ref={buttonRef}>
                            <CircleButton href="#contact" variant="espresso">Grab a coffee?</CircleButton>
                        </div>
                    </div>
                </div>

                <div ref={detailsRef} className="mt-20 grid gap-12 sm:mt-28 md:grid-cols-12 md:gap-6">
                    <p className="text-lg leading-relaxed text-[#5c4a3d] sm:text-xl md:col-span-5">
                        From completing six full marathons to building products that solve real problems,
                        I've learned to embrace the unfamiliar and enjoy the process of figuring things out.
                    </p>
                    <div className="md:col-span-6 md:col-start-7">
                        <CafeMenu />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
