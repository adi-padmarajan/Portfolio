import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutTitle, CircleButton, Education } from "../components";

gsap.registerPlugin(ScrollTrigger);

function About(){
    const contentRef = useRef<HTMLDivElement>(null);

    // Fade the statement, supporting text, education and button in one after another as they scroll into view
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

    // Fill exactly one screen and centre the content; the top padding clears the fixed navbar
    return(
        <div
            ref={contentRef}
            className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center bg-white px-6 pt-24 pb-8 sm:pb-16 md:px-10 lg:px-12"
        >
            <AboutTitle />

            <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-12 md:mt-14 md:grid-cols-12 md:gap-6">
                {/* Role and company in black carry the statement; the rest recedes in grey */}
                <p data-animate className="text-2xl leading-snug tracking-tight text-gray-400 sm:text-4xl md:col-span-7 lg:text-5xl lg:leading-tight">
                    <span className="text-black">Software Developer at STEMCELL&nbsp;Technologies,</span>{" "}
                    building Custom Products for Research and Development.
                </p>

                <div className="flex flex-col gap-6 sm:gap-10 md:col-span-4 md:col-start-9 md:gap-12 md:pt-2">
                    {/* Education reads as a caption to the supporting text, so keep them close */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <p data-animate className="text-sm leading-relaxed text-gray-600 sm:text-lg">
                            On the Software Development Engineering team, I turn lab needs into reliable, purpose-built software.
                        </p>
                        <Education />
                    </div>

                    <div data-animate>
                        <CircleButton href="#contact">Get in touch</CircleButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
