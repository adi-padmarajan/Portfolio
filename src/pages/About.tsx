import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MOTION_OK } from "../lib/motion";
import { AboutTitle, CircleButton, Education } from "../components";

gsap.registerPlugin(ScrollTrigger, SplitText);

function About(){
    const sectionRef = useRef<HTMLDivElement>(null);
    const statementRef = useRef<HTMLParagraphElement>(null);
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
              .from(detailsRef.current?.children ?? [], { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, "-=0.6");

            return () => split.revert();
        });
        return () => mm.revert();
    }, []);

    // The same structure as Contact, so the two sections read as one system: a statement, a rule with the
    // round button resting on it, and the details beneath. Plenty of air between each tier; the top padding
    // clears the fixed navbar.
    return(
        <div
            ref={sectionRef}
            className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center bg-white px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 md:px-10 lg:px-12"
        >
            <AboutTitle />

            {/* Role and company in black carry the statement; the rest recedes in grey */}
            <p
                ref={statementRef}
                className="mt-8 max-w-5xl text-3xl leading-[1.15] font-medium tracking-tight text-gray-400 sm:mt-10 sm:text-5xl lg:text-6xl lg:leading-[1.1]"
            >
                <span className="text-black">Software Developer at STEMCELL&nbsp;Technologies,</span>{" "}
                building Custom Products for Research and Development.
            </p>

            {/* The button straddles the rule, as if it were resting on it */}
            <div className="relative mt-20 sm:mt-28">
                <div ref={ruleRef} className="h-px origin-left bg-gray-200" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 sm:right-12 lg:right-24">
                    <div ref={buttonRef}>
                        <CircleButton href="#contact">Get in touch</CircleButton>
                    </div>
                </div>
            </div>

            <div ref={detailsRef} className="mt-20 grid gap-10 sm:mt-28 md:grid-cols-12 md:gap-6">
                <p className="text-lg leading-relaxed text-gray-600 sm:text-xl md:col-span-5">
                    On the Software Development Engineering team, I turn lab needs into reliable, purpose-built software.
                </p>
                <div className="md:col-span-3 md:col-start-7">
                    <Education />
                </div>
            </div>
        </div>
    );
}

export default About;
