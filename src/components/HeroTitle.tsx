import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

function HeroTitle(){
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.from(titleRef.current, {
                y: 40,
                opacity: 0,
                duration: 1,
            }).from(subtitleRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.8,
            }, "-=0.5");
        });
        return () => ctx.revert();
    }, []);

    return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <h1 ref={titleRef} className="text-6xl font-extrabold tracking-tight text-black sm:text-8xl lg:text-9xl">
            Hi! I am Adi.
        </h1>
        <p ref={subtitleRef} className="mt-4 text-xl font-medium tracking-wide text-gray-500 sm:mt-6 sm:text-3xl">
            Software Developer
        </p>
    </section>
    );
}

export default HeroTitle;
