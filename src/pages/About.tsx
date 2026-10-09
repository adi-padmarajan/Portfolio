import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MOTION_OK } from "../lib/motion";
import { AboutFact, AboutTitle, ArrowLink } from "../components";

gsap.registerPlugin(ScrollTrigger, SplitText);

function About(){
    const sectionRef = useRef<HTMLDivElement>(null);
    const statementRef = useRef<HTMLParagraphElement>(null);
    const detailRef = useRef<HTMLDivElement>(null);
    const factsRef = useRef<HTMLDivElement>(null);

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
                    end: "bottom 45%",
                    scrub: true,
                },
            });

            // The supporting paragraph and link follow once the statement has had its moment
            gsap.from(detailRef.current?.children ?? [], {
                y: 24,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: detailRef.current,
                    start: "top 85%",
                },
            });

            // Each fact's hairline draws across, left to right, and its text settles in just behind it
            gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: factsRef.current,
                    start: "top 85%",
                },
            })
              .from("[data-fact-rule]", { scaleX: 0, duration: 1.1, ease: "power4.inOut", stagger: 0.12 })
              .from("[data-fact-content]", { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, "-=0.7");

            return () => split.revert();
        });
        return () => mm.revert();
    }, []);

    // Three quiet tiers with plenty of air between them: one statement, a short paragraph to explain it,
    // and a row of facts to scan. The top padding clears the fixed navbar.
    return(
        <div
            ref={sectionRef}
            className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center bg-white px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 md:px-10 lg:px-12"
        >
            <AboutTitle />

            <p
                ref={statementRef}
                className="mt-8 max-w-4xl text-4xl leading-[1.1] font-medium tracking-tight text-black sm:mt-10 sm:text-5xl lg:text-6xl"
            >
                I turn lab needs into reliable, purpose&#8209;built software.
            </p>

            <div ref={detailRef} className="mt-12 flex flex-col gap-8 sm:mt-16 md:ml-auto md:w-1/2 md:pl-6">
                <p className="text-lg leading-relaxed text-gray-600 sm:text-xl">
                    I&rsquo;m a Software Developer on the Software Development Engineering team at
                    STEMCELL&nbsp;Technologies, building custom products for Research and Development.
                </p>
                <div>
                    <ArrowLink href="#contact">Get in touch</ArrowLink>
                </div>
            </div>

            <div ref={factsRef} className="mt-24 grid gap-10 sm:mt-32 md:grid-cols-3 md:gap-8">
                <AboutFact label="Currently">
                    Software Developer
                    <br />
                    STEMCELL Technologies
                </AboutFact>
                <AboutFact label="Education">
                    BSc Computer Science
                    <br />
                    University of Victoria
                </AboutFact>
                <AboutFact label="Outside work">
                    Running marathons
                </AboutFact>
            </div>
        </div>
    );
}

export default About;
