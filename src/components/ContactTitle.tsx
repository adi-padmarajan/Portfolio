import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ContactTitle(){
    const titleRef = useRef<HTMLHeadingElement>(null);

    // Play when the title scrolls into view, since it sits near the bottom of the page
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
    <h2 ref={titleRef} className="text-xs font-medium tracking-widest text-white/40 uppercase">
        Contact
    </h2>
    );
}

export default ContactTitle;
