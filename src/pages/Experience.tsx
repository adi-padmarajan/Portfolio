import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "../lib/motion";
import { EXPERIENCES, ExperienceDialog } from "../components";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

function Experience(){
    const sectionRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const mm = gsap.matchMedia(sectionRef);
        mm.add(MOTION_OK, () => {
            // The label and statement rise in together
            gsap.from(section.querySelectorAll("[data-heading]"), {
                y: 40,
                autoAlpha: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                },
            });

            // Each rule draws across as its row reaches the viewport, and the row settles in just behind it
            // (the closing rule has no row to follow it)
            section.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
                const tl = gsap.timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                        trigger: row,
                        start: "top 90%",
                    },
                })
                  .from(row.querySelector("[data-rule]"), { scaleX: 0, duration: 1.2, ease: "power4.inOut" });

                const content = row.querySelector("[data-content]");
                if (content) tl.from(content, { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.7");
            });
        });
        return () => mm.revert();
    }, []);

    // A ruled list in the About section's language: one row per role, newest first. Each row opens a dialog with
    // the full detail, so the list itself stays scannable.
    return(
        <div
            ref={sectionRef}
            className="mx-auto max-w-6xl bg-white px-6 pt-16 pb-24 sm:pt-24 sm:pb-40 md:px-10 lg:px-12"
        >
            <h2 data-heading className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                Experience
            </h2>

            <div className="mt-8 flex flex-col gap-6 sm:mt-10 md:flex-row md:items-end md:justify-between">
                <p
                    data-heading
                    className="max-w-3xl text-3xl leading-[1.15] font-medium tracking-tight text-gray-400 sm:text-5xl lg:leading-[1.1]"
                >
                    <span className="text-black">Building software people rely on,</span>{" "}
                    from research labs to nonprofits.
                </p>
                <p data-heading className="text-sm text-gray-400 md:pb-2">
                    Select a role for the details
                </p>
            </div>

            {/* While a row is hovered, the others step back so it stands out */}
            <ul className="group/list mt-16 sm:mt-24">
                {EXPERIENCES.map((experience, i) => (
                    <li key={experience.company} data-row>
                        <div data-rule className="h-px origin-left bg-gray-200" />
                        <div data-content>
                            <button
                                type="button"
                                aria-haspopup="dialog"
                                onClick={() => setOpenIndex(i)}
                                className="group flex w-full items-start gap-4 py-8 text-left transition-opacity duration-500 group-hover/list:opacity-40 hover:opacity-100! focus-visible:opacity-100! sm:gap-6 sm:py-10 md:items-center"
                            >
                                <span className="w-6 shrink-0 pt-2 text-xs text-gray-400 tabular-nums transition-colors group-hover:text-black sm:w-8 sm:pt-3 md:pt-0">
                                    {pad(i + 1)}
                                </span>

                                <span className="grid min-w-0 flex-1 gap-1.5 md:grid-cols-12 md:items-center md:gap-6">
                                    <span className="text-2xl font-medium tracking-tight text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 sm:text-4xl md:col-span-5">
                                        {experience.company}
                                    </span>
                                    <span className="text-base text-gray-500 md:col-span-4">{experience.role}</span>
                                    <span className="text-sm text-gray-400 tabular-nums md:col-span-3 md:text-right">
                                        {experience.period}
                                    </span>
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 transition-colors duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white sm:h-14 sm:w-14"
                                >
                                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-90 sm:h-4 sm:w-4">
                                        <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <span className="sr-only">View details</span>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div data-row>
                <div data-rule className="h-px origin-left bg-gray-200" />
            </div>

            <ExperienceDialog
                experiences={EXPERIENCES}
                index={openIndex}
                onNavigate={setOpenIndex}
                onClose={() => setOpenIndex(null)}
            />
        </div>
    );
}

export default Experience;
