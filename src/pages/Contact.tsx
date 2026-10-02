import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleButton, ContactStatement, ContactTitle, EMAIL, EmailLink, SocialLinks } from "../components";

gsap.registerPlugin(ScrollTrigger);

function Contact(){
    const contentRef = useRef<HTMLDivElement>(null);

    // Fade the statement, email, socials and button in one after another as they scroll into view
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

    // Mirrors the About layout: statement on the left, supporting details in the right-hand column
    return(
        <div
            ref={contentRef}
            className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center bg-white px-6 pt-24 pb-8 sm:pb-16 md:px-10 lg:px-12"
        >
            <ContactTitle />

            <div className="mt-6 grid gap-10 sm:mt-8 sm:gap-12 md:mt-14 md:grid-cols-12 md:gap-6">
                <div className="flex flex-col gap-6 sm:gap-10 md:col-span-7">
                    <ContactStatement />
                    <EmailLink />
                </div>

                <div className="flex flex-col gap-8 sm:gap-10 md:col-span-4 md:col-start-9 md:gap-12 md:pt-2">
                    <SocialLinks />

                    <div data-animate>
                        <CircleButton href={`mailto:${EMAIL}`}>Say hello</CircleButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
