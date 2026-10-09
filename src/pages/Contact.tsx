import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "../lib/motion";
import {
    BackToTopLink,
    CircleButton,
    ContactTitle,
    CopyEmailButton,
    EMAIL,
    FooterItem,
    LocalTime,
    PillLink,
    SOCIAL_LINKS,
    SocialLink,
} from "../components";

gsap.registerPlugin(ScrollTrigger);

function Contact(){
    const contentRef = useRef<HTMLDivElement>(null);

    // Fade the headline, button and email pills in one after another as they scroll into view
    useLayoutEffect(() => {
        const mm = gsap.matchMedia(contentRef);
        mm.add(MOTION_OK, () => {
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
        });
        return () => mm.revert();
    }, []);

    const year = new Date().getFullYear();

    // A dark closing screen: the invitation fills the space, and the footer details sit along the bottom edge
    return(
        <div ref={contentRef} className="flex min-h-svh flex-col bg-neutral-950 text-white">
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-28 pb-16 md:px-10 lg:px-12">
                <ContactTitle />

                <div className="mt-6 flex items-end justify-between gap-6 sm:mt-8">
                    <p data-animate className="text-5xl leading-[0.95] font-medium tracking-tight sm:text-7xl lg:text-8xl">
                        Let’s work
                        <br />
                        together
                    </p>
                    <span aria-hidden="true" className="hidden text-3xl text-white/60 md:block lg:text-4xl">
                        ↙
                    </span>
                </div>

                {/* The button straddles the rule, as if it were resting on it */}
                <div className="relative mt-16 sm:mt-24">
                    <div className="h-px bg-white/15" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 sm:right-12 lg:right-24">
                        <div data-animate>
                            <CircleButton href={`mailto:${EMAIL}`} variant="light" size="lg">
                                Get in touch
                            </CircleButton>
                        </div>
                    </div>
                </div>

                <div data-animate className="mt-20 flex flex-col gap-3 sm:mt-28 sm:flex-row sm:flex-wrap sm:gap-4">
                    <PillLink href={`mailto:${EMAIL}`}>{EMAIL}</PillLink>
                    <CopyEmailButton />
                </div>
            </div>

            <footer className="grid grid-cols-2 gap-x-6 gap-y-10 px-6 pt-10 pb-8 md:grid-cols-12 md:px-10 md:pb-10 lg:px-12">
                <div className="md:col-span-3">
                    <FooterItem label="Copyright">&copy; {year} Aditya Padmarajan</FooterItem>
                </div>

                <div className="md:col-span-3">
                    <FooterItem label="Local time">
                        <LocalTime />
                    </FooterItem>
                </div>

                <div className="col-span-2 md:col-span-6 md:justify-self-end">
                    <FooterItem label="Socials">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2">
                            {SOCIAL_LINKS.map((link) => (
                                <li key={link.href}>
                                    <SocialLink label={link.label} href={link.href} />
                                </li>
                            ))}
                            <li className="text-white/80">
                                <BackToTopLink />
                            </li>
                        </ul>
                    </FooterItem>
                </div>
            </footer>
        </div>
    );
}

export default Contact;
