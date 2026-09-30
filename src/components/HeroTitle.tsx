import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

function HeroTitle(){
    const titleRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            });
        });
        return () => ctx.revert();
    }, []);

    return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-7xl">
            Hi! I am Adi.
        </h1>
    </section>
    );
}

export default HeroTitle;
