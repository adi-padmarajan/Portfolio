import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "../lib/motion";
import {
    AwakeStatus,
    BackToTopLink,
    ContactRow,
    EMAIL,
    GreetingRoll,
    NAV_LINKS,
    SOCIAL_LINKS,
    Wordmark,
} from "../components";
import { WORDMARK_HEIGHT } from "../components/wordmarkGeometry";

gsap.registerPlugin(ScrollTrigger);

// Every section but this one, for the footer's short index
const SECTION_LINKS = NAV_LINKS.filter((link) => link.href !== "#contact");

/**
 * Renders contact methods, Vancouver availability, and footer navigation with a
 * closing wordmark. Runs scroll animations when reduced motion is not requested
 * and reverts them on unmount or a change to that preference.
 */
function Contact(){
    const rootRef = useRef<HTMLDivElement>(null);
    const lettersRef = useRef<SVGGElement>(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const mm = gsap.matchMedia(rootRef);
        mm.add(MOTION_OK, () => {
            // The label, headline and note rise in together
            gsap.from(root.querySelectorAll("[data-reveal]"), {
                y: 40,
                autoAlpha: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: root,
                    start: "top 70%",
                },
            });

            // As in Experience: each rule draws across, and its row settles in just behind it
            root.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
                gsap.timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                        trigger: row,
                        start: "top 90%",
                    },
                })
                  .from(row.querySelector("[data-rule]"), { scaleX: 0, duration: 1.2, ease: "power4.inOut" })
                  .from(row.querySelector("[data-content]"), { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.7");
            });

            // The name rises out of the page's bottom edge, letter by letter, in step with the last of the scroll.
            // The hero dives into the d; the page ends with the whole word back in view.
            gsap.from(lettersRef.current?.children ?? [], {
                y: WORDMARK_HEIGHT * 1.1,
                ease: "none",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: "[data-wordmark]",
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 0.6,
                },
            });
        });
        return () => mm.revert();
    }, []);

    const year = new Date().getFullYear();

    // The last screen: an open invitation, the ways to reach me, then a closing footer signed with the wordmark
    return(
        <div ref={rootRef} className="overflow-hidden bg-neutral-950 text-white">
            <div className="mx-auto max-w-6xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 md:px-10 lg:px-12">
                <h2 data-reveal className="text-xs font-medium tracking-widest text-white/40 uppercase">
                    Contact
                </h2>

                <p
                    data-reveal
                    className="mt-8 text-6xl leading-none font-medium tracking-tight sm:mt-10 sm:text-8xl lg:text-9xl"
                >
                    <span className="sr-only">Say hello</span>
                    <span aria-hidden="true">
                        <span className="text-white/40">Say</span> <GreetingRoll />
                    </span>
                </p>

                <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-24 lg:grid-cols-12 lg:gap-6">
                    <div className="flex flex-col gap-8 lg:col-span-4">
                        <p data-reveal className="text-lg leading-relaxed text-white/60 sm:text-xl">
                            Whether it’s a role, a project or a hackathon team that needs one more,{" "}
                            <span className="text-white">my inbox is open.</span>
                        </p>
                        <div data-reveal>
                            <AwakeStatus />
                        </div>
                    </div>

                    <div className="lg:col-span-8 lg:col-start-5">
                        <ul>
                            <ContactRow label="Email" value={EMAIL} href={`mailto:${EMAIL}`} copy />
                            {SOCIAL_LINKS.map((link) => (
                                <ContactRow key={link.href} label={link.label} value={link.handle} href={link.href} />
                            ))}
                        </ul>
                        <div data-row>
                            <div data-rule className="h-px origin-left bg-white/15" />
                        </div>
                    </div>
                </div>
            </div>

            <footer className="px-6 pb-6 md:px-10 md:pb-8 lg:px-12">
                <div className="flex flex-col gap-6 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; {year} Aditya Padmarajan</p>
                    <nav aria-label="Footer">
                        <ul className="flex flex-wrap gap-x-6 gap-y-2">
                            {SECTION_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} className="transition-colors hover:text-white">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <BackToTopLink />
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* The SVG's edge masks the letters as they rise; capped by height so it never outgrows the screen */}
                <div
                    data-wordmark
                    aria-hidden="true"
                    className="mx-auto mt-10 w-[min(100%,calc(62svh*1.9))] text-white sm:mt-16"
                >
                    <Wordmark letterRef={lettersRef} />
                </div>
            </footer>
        </div>
    );
}

export default Contact;
