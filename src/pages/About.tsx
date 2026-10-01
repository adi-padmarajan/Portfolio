import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutTitle, CircleButton, CurrentRole, Education } from "../components";

gsap.registerPlugin(ScrollTrigger);

function About(){
    const contentRef = useRef<HTMLDivElement>(null);

    // Fade the statement, details and education in one after another as they scroll into view
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from("[data-animate]", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 85%",
                },
            });
        }, contentRef);
        return () => ctx.revert();
    }, []);

    // Fill exactly one screen; the top padding clears the fixed navbar
    return(
        <div
            ref={contentRef}
            className="mx-auto flex min-h-svh max-w-6xl flex-col justify-between bg-white px-6 pt-24 pb-10 sm:pt-28 sm:pb-12 md:px-10 lg:px-12"
        >
            <div>
                <AboutTitle />

                <div className="mt-6 grid gap-8 md:mt-12 md:grid-cols-12 md:gap-6">
                    <p data-animate className="text-2xl leading-snug tracking-tight text-black sm:text-4xl md:col-span-7 lg:text-5xl lg:leading-tight">
                        Software Developer at STEMCELL Technologies, building custom products for Research and Development.
                    </p>

                    <div data-animate className="flex flex-col items-start gap-6 md:col-span-4 md:col-start-9 md:gap-12">
                        <p className="text-sm leading-relaxed text-gray-600 sm:text-lg">
                            I work in the Software Development Engineering (SDE) team, turning lab needs into reliable, purpose-built software.
                        </p>
                        <CircleButton href="#contact">Get in touch</CircleButton>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-gray-100 pt-6 sm:mt-12 sm:pt-8 md:grid-cols-12">
                <div className="md:col-span-7">
                    <CurrentRole />
                </div>
                <div className="md:col-span-4 md:col-start-9">
                    <Education />
                </div>
            </div>
        </div>
    );
}

export default About;
