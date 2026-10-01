import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AboutTitle(){
    const titleRef = useRef<HTMLHeadingElement>(null);

    // Play when the title scrolls into view, since it sits below the hero
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 85%",
                },
            });
        });
        return () => ctx.revert();
    }, []);

    return (
    <div className="flex flex-col items-center bg-white px-4 pt-32 text-center">
        <h2 ref={titleRef} className="text-5xl font-extrabold tracking-tight text-black sm:text-7xl lg:text-8xl">
            About
        </h2>
    </div>
    );
}

export default AboutTitle;
