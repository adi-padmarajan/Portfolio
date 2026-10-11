import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

function AboutTitle(){
    const titleRef = useRef<HTMLHeadingElement>(null);

    // Play when the title scrolls into view, since it sits below the hero
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
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
        return () => mm.revert();
    }, []);

    return (
    <h2 ref={titleRef} className="text-xs font-medium tracking-widest text-[#8c7a6b] uppercase">
        About <span aria-hidden="true">·</span> Over coffee
    </h2>
    );
}

export default AboutTitle;
