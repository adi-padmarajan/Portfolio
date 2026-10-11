import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "../lib/motion";
import { CircleButton, PROJECTS, ProjectCard, SOCIAL_LINKS } from "../components";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

const GITHUB = SOCIAL_LINKS.find((link) => link.label === "GitHub")!.href;

function Projects(){
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const mm = gsap.matchMedia(sectionRef);
        mm.add(MOTION_OK, () => {
            // The label and statement rise in together, as in Experience
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

            // Each cover is unveiled from the bottom up, and its text settles in just behind it
            section.querySelectorAll<HTMLElement>("[data-project]").forEach((project) => {
                gsap.timeline({
                    defaults: { ease: "power4.out" },
                    scrollTrigger: {
                        trigger: project,
                        start: "top 85%",
                    },
                })
                  .from(project.querySelector("[data-cover]"), { clipPath: "inset(100% 0% 0% 0% round 1.5rem)", duration: 1.2, ease: "power4.inOut" })
                  .from(project.querySelector("[data-body]"), { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.5");
            });

            // The closing rule draws across and the button settles onto it
            const outro = section.querySelector("[data-outro]");
            gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: outro,
                    start: "top 85%",
                },
            })
              .from(outro?.querySelector("[data-rule]") ?? [], { scaleX: 0, duration: 1.2, ease: "power4.inOut" })
              .from(outro?.querySelector("[data-button]") ?? [], { scale: 0.6, autoAlpha: 0, duration: 0.9, ease: "back.out(1.6)" }, "-=0.5");
        });
        return () => mm.revert();
    }, []);

    // A two-column gallery whose second column sits lower, so the grid reads as a loose, editorial stagger
    // rather than a table. It closes on the same rule-and-button motif as About.
    return(
        <div
            ref={sectionRef}
            className="mx-auto max-w-6xl bg-white px-6 pt-16 pb-24 sm:pt-24 sm:pb-40 md:px-10 lg:px-12"
        >
            <h2 data-heading className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                Featured Projects
            </h2>

            <div className="mt-8 flex flex-col gap-6 sm:mt-10 md:flex-row md:items-end md:justify-between">
                <p
                    data-heading
                    className="max-w-3xl text-3xl leading-[1.15] font-medium tracking-tight text-gray-400 sm:text-5xl lg:leading-[1.1]"
                >
                    <span className="text-black">Things I’ve built,</span>{" "}
                    from hackathon weekends to research.
                </p>
                <p data-heading className="text-sm text-gray-400 tabular-nums md:pb-2">
                    {pad(PROJECTS.length)} projects
                </p>
            </div>

            <ul className="mt-16 grid gap-20 sm:mt-24 md:grid-cols-2 md:gap-x-10 md:gap-y-28 lg:gap-x-16">
                {PROJECTS.map((project, i) => (
                    <li key={project.title} data-project className="md:even:translate-y-32">
                        <ProjectCard project={project} number={pad(i + 1)} />
                    </li>
                ))}
            </ul>

            {/* The button straddles the rule, as if it were resting on it; the extra top margin clears the stagger */}
            <div data-outro className="relative mt-24 sm:mt-32 md:mt-56">
                <div data-rule className="h-px origin-left bg-gray-200" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 sm:right-12 lg:right-24">
                    <div data-button>
                        <CircleButton href={GITHUB}>
                            <span className="text-center">More on<br />GitHub</span>
                        </CircleButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Projects;
