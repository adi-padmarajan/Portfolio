import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MOTION_OK } from "../lib/motion";
import { AboutTitle, CircleButton, CoffeeGlass } from "../components";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Line icons for the traits, drawn on a 24-unit grid to match the type's weight
const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const TRAITS: { label: string; icon: ReactNode }[] = [
    {
        label: "6× Marathon Finisher",
        icon: (
            <>
                {/* A finisher's medal on its ribbon */}
                <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" {...ICON} />
                <path d="M11 12 5.12 2.2" {...ICON} />
                <path d="m13 12 5.88-9.8" {...ICON} />
                <path d="M8 7h8" {...ICON} />
                <circle cx="12" cy="17" r="5" {...ICON} />
                <path d="M12 18v-2h-.5" {...ICON} />
            </>
        ),
    },
    {
        label: "Builder",
        icon: (
            <>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" {...ICON} />
                <path d="m3.3 7 8.7 5 8.7-5" {...ICON} />
                <path d="M12 22V12" {...ICON} />
            </>
        ),
    },
    {
        label: "Curious by nature",
        icon: (
            <>
                <circle cx="12" cy="12" r="10" {...ICON} />
                <path d="m16.24 7.76-1.8 5.41a2 2 0 0 1-1.27 1.27L7.76 16.24l1.8-5.41a2 2 0 0 1 1.27-1.27z" {...ICON} />
            </>
        ),
    },
];

const DETAILS = [
    { label: "Currently", value: "Software Developer at STEMCELL Technologies" },
    { label: "Education", value: "BSc Computer Science, University of Victoria" },
    { label: "Beyond code", value: "Photography, black coffee, and building things that matter" },
];

// The next page of the story, in the hero's black and white: what drives me, a glass of black coffee to drink
// while you read it, and the details beneath.
function About(){
    const sectionRef = useRef<HTMLDivElement>(null);
    const statementRef = useRef<HTMLParagraphElement>(null);
    const ruleRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDListElement>(null);

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

            // The rule draws across and the button settles onto it; then the story, its traits and the details
            // beside them follow one after another
            gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: ruleRef.current,
                    start: "top 85%",
                },
            })
              .from(ruleRef.current, { scaleX: 0, duration: 1.2, ease: "power4.inOut" })
              .from(buttonRef.current, { scale: 0.6, autoAlpha: 0, duration: 0.9, ease: "back.out(1.6)" }, "-=0.5")
              .from(storyRef.current?.children ?? [], { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, "-=0.6")
              .from(detailsRef.current?.children ?? [], { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, "-=0.8");

            return () => split.revert();
        });
        return () => mm.revert();
    }, []);

    // The statement and the glass share the top; on smaller screens the glass follows the words. The round button
    // rests on the rule beneath the glass. Below, the story and its traits sit beside the details, divided by a
    // hairline that turns horizontal when they stack. The top padding clears the fixed navbar.
    return(
        <div
            ref={sectionRef}
            className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center bg-white px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 md:px-10 lg:px-12"
        >
            <AboutTitle />

            <div className="mt-8 grid items-center gap-12 sm:mt-10 lg:grid-cols-12 lg:gap-10">
                {/* The opening sentence in black carries the statement; the rest recedes in grey */}
                <p
                    ref={statementRef}
                    className="text-3xl leading-[1.12] font-semibold tracking-tight text-gray-400 sm:text-5xl lg:col-span-8 lg:text-[3.5rem] lg:leading-[1.08]"
                >
                    <span className="text-black">I've always been drawn to a&nbsp;challenge.</span>{" "}
                    Whether that means turning ambitious ideas into something real, or pushing my limits across
                    42.2&nbsp;kilometres.
                </p>

                {/* The glass of coffee, standing on its own beside the words */}
                <div className="w-[min(68vw,32svh,17rem)] justify-self-center sm:w-[min(44vw,36svh,20rem)] lg:col-span-4 lg:w-full lg:max-w-[22rem] lg:justify-self-end">
                    <div className="px-[6%]">
                        <CoffeeGlass />
                    </div>
                </div>
            </div>

            {/* The button rests on the rule, centred beneath the glass on large screens */}
            <div className="relative mt-14 grid sm:mt-16 lg:grid-cols-12 lg:gap-10">
                <div ref={ruleRef} className="absolute inset-x-0 top-1/2 h-px origin-left bg-gray-200" />
                <div
                    ref={buttonRef}
                    className="relative justify-self-end sm:mr-12 lg:col-span-4 lg:col-start-9 lg:mr-0 lg:w-full lg:max-w-[22rem] lg:justify-self-end"
                >
                    <div className="flex justify-center">
                        <CircleButton href="#contact">Let's connect</CircleButton>
                    </div>
                </div>
            </div>

            <div className="mt-14 grid gap-12 sm:mt-16 md:grid-cols-12 md:gap-0">
                <div ref={storyRef} className="md:col-span-7 md:pr-12 lg:pr-16">
                    <p className="max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                        From completing six full marathons to building products that solve real problems, I've learned
                        that progress comes from curiosity, consistency, and a willingness to figure things out.
                    </p>
                    {/* The traits run in a row divided by hairlines where there's room for all three, and stack otherwise */}
                    <ul className="mt-8 flex flex-col gap-4 text-sm text-gray-600 sm:mt-10 sm:text-base xl:flex-row xl:items-center xl:gap-0">
                        {TRAITS.map((trait, i) => (
                            <li
                                key={trait.label}
                                className={`flex items-center gap-3 xl:py-1 ${i > 0 ? "xl:border-l xl:border-gray-200 xl:pl-6" : ""} ${i < TRAITS.length - 1 ? "xl:pr-6" : ""}`}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 shrink-0 text-black">
                                    {trait.icon}
                                </svg>
                                {trait.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <dl
                    ref={detailsRef}
                    className="space-y-7 border-t border-gray-200 pt-10 md:col-span-5 md:border-t-0 md:border-l md:pt-0 md:pl-10 lg:pl-12"
                >
                    {DETAILS.map((detail) => (
                        <div key={detail.label}>
                            <dt className="text-[0.625rem] font-medium tracking-widest text-gray-400 uppercase sm:text-xs">
                                {detail.label}
                            </dt>
                            <dd className="mt-2 text-base text-gray-700 sm:text-lg">{detail.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}

export default About;
