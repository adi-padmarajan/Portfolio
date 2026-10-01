import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutTitle } from "../components";

gsap.registerPlugin(ScrollTrigger);

const currentRole = [
    { label: "Role", value: "Software Developer" },
    { label: "Company", value: "STEMCELL Technologies" },
    { label: "Team", value: "R&D Custom Products" },
];

function About(){
    const contentRef = useRef<HTMLDivElement>(null);

    // Fade the bio and role details in one after another as they scroll into view
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

    return(
        <>
            <AboutTitle />
            <div ref={contentRef} className="mx-auto max-w-3xl bg-white px-6 pt-12 pb-32 text-center">
                <p data-animate className="text-xl leading-relaxed text-gray-600 sm:text-2xl">
                    I'm a <span className="font-semibold text-black">Software Developer</span> at{" "}
                    <span className="font-semibold text-black">STEMCELL Technologies</span>, where I work
                    on Research and Development for Custom Products.
                </p>

                <dl data-animate className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
                    {currentRole.map((item) => (
                        <div key={item.label}>
                            <dt className="text-sm font-medium tracking-widest text-gray-400 uppercase">
                                {item.label}
                            </dt>
                            <dd className="mt-2 text-lg font-bold tracking-tight text-black">
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </>
    );
}

export default About;
