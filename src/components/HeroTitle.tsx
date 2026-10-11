import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import HeroDetail from "./HeroDetail";
import LocalTime from "./LocalTime";
import ScrollCue from "./ScrollCue";
import Wordmark from "./Wordmark";
import { D_COUNTER, WORDMARK_HEIGHT, WORDMARK_WIDTH } from "./wordmarkGeometry";
import { MOTION_OK } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

// The subtitle cycles through these, starting with the first
const ROLES = ["Software Engineer", "I build things", "I drink a lot of coffee"];

// Scale the wordmark about the d's counter, so the counter stays put while everything else rushes outward
const ZOOM_ORIGIN = `${(D_COUNTER.x / WORDMARK_WIDTH) * 100}% ${(D_COUNTER.y / WORDMARK_HEIGHT) * 100}%`;

type HeroTitleProps = {
    // True while the intro overlay is still on screen
    introActive: boolean;
};

function HeroTitle({ introActive }: HeroTitleProps){
    const sectionRef = useRef<HTMLElement>(null);
    const leadRef = useRef<HTMLSpanElement>(null);
    const markRef = useRef<HTMLSpanElement>(null);
    const lettersRef = useRef<SVGGElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const roleRef = useRef<HTMLSpanElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    // The site mounts as the intro overlay starts sliding away, so this is read once, on mount
    const [followsIntro] = useState(introActive);

    // Entrance: the letters rise out of the wordmark's edge one after another, then the lines around them
    // slide out of their own masks. Each mask (the outer element) is left free for the scroll animation below.
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            // Swap roles with a brief scramble, holding each one long enough to read
            const cycle = gsap.timeline({ paused: true, repeat: -1 });
            ROLES.forEach((_, i) => {
                cycle.to(roleRef.current, {
                    duration: 1,
                    ease: "none",
                    scrambleText: {
                        text: ROLES[(i + 1) % ROLES.length],
                        chars: "lowerCase",
                        speed: 0.6,
                    },
                }, "+=2.8");
            });

            // After the intro, start while the overlay is still lifting, so the name rises into the space it uncovers
            gsap.timeline({ delay: followsIntro ? 0.45 : 0.15, defaults: { ease: "power4.out" } })
              .from(lettersRef.current?.children ?? [], {
                y: WORDMARK_HEIGHT * 1.1,
                duration: 1.3,
                stagger: 0.09,
            })
              .from([leadRef.current?.firstElementChild, subtitleRef.current?.firstElementChild], {
                yPercent: 110,
                duration: 1,
            }, "-=0.9")
              .from(detailsRef.current?.children ?? [], {
                y: 12,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
            }, "-=0.6")
              .add(() => { cycle.play(); });
        });
        return () => mm.revert();
    }, [followsIntro]);

    // Scrolling: the hero holds still while the camera dives into the d. The counter grows until it swallows
    // the screen, and its white opens straight onto About.
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const mark = markRef.current!;
            const section = sectionRef.current!;
            const header = document.querySelector("[data-site-header]");
            const zoom = { progress: 0 };
            let maxScale = 1;

            // How far to scale before the counter's incircle covers every corner of the screen
            const measure = () => {
                const scale = gsap.getProperty(mark, "scale") as number;
                const rect = mark.getBoundingClientRect();
                const top = section.getBoundingClientRect().top;
                // The counter is the transform origin, so its position on screen is the same at any scale
                const x = rect.left + (D_COUNTER.x / WORDMARK_WIDTH) * rect.width;
                const y = rect.top - top + (D_COUNTER.y / WORDMARK_HEIGHT) * rect.height;
                const reach = Math.max(
                    Math.hypot(x, y),
                    Math.hypot(window.innerWidth - x, y),
                    Math.hypot(x, window.innerHeight - y),
                    Math.hypot(window.innerWidth - x, window.innerHeight - y),
                );
                const radius = (D_COUNTER.r / WORDMARK_HEIGHT) * (rect.height / scale);
                maxScale = (reach / radius) * 1.05;
            };
            // Scale exponentially: equal scroll distances feel like equal distances travelled, like a camera dolly
            const applyZoom = () => gsap.set(mark, { scale: maxScale ** zoom.progress });

            measure();
            gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=120%",
                    pin: true,
                    scrub: true,
                    onRefresh: () => {
                        measure();
                        applyZoom();
                    },
                },
            })
              // The words around the name part to let it through
              .to(leadRef.current, { yPercent: -60, autoAlpha: 0, duration: 0.15 }, 0)
              .to(subtitleRef.current, { yPercent: 60, autoAlpha: 0, duration: 0.15 }, 0)
              .to(detailsRef.current, { autoAlpha: 0, duration: 0.1 }, 0)
              // Finish a little early, so the screen is fully white for a beat before the navbar returns
              .to(zoom, { progress: 1, duration: 0.85, ease: "power1.in", onUpdate: applyZoom }, 0)
              // The navbar's frosted white would turn grey over the letters, so it steps aside for the shot
              // and returns once the counter has turned the screen white
              .to(header, { yPercent: -100, duration: 0.08 }, 0)
              .to(header, { yPercent: 0, duration: 0.08 }, 0.92);
        });
        return () => mm.revert();
    }, []);

    // A short, centred stack ("I am", the wordmark, the role) with generous space around it, so it reads in one glance.
    // The wordmark is capped by width and height alike, so it never crowds the screen.
    // Screen readers hear "I am Adi", then every role at once instead of the changing text.
    return (
    <section ref={sectionRef} className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-white px-6 md:px-10 lg:px-12">
        <div className="flex flex-col items-center text-center">
            <h1>
                <span ref={leadRef} className="block overflow-hidden text-2xl font-medium tracking-tight text-gray-500 sm:text-3xl lg:text-4xl">
                    <span className="block">I am</span>
                </span>
                <span className="sr-only">Adi</span>
                <span
                    ref={markRef}
                    aria-hidden="true"
                    style={{ transformOrigin: ZOOM_ORIGIN }}
                    className="mx-auto mt-6 block w-[min(68vw,calc(27svh*1.9),36rem)] text-black sm:mt-8 lg:mt-10"
                >
                    <Wordmark letterRef={lettersRef} />
                </span>
            </h1>
            <p ref={subtitleRef} className="mt-6 overflow-hidden text-2xl font-medium tracking-tight text-gray-500 sm:mt-8 sm:text-3xl lg:mt-10 lg:text-4xl">
                <span className="block whitespace-nowrap">
                    <span className="sr-only">{ROLES.join(" and ")}</span>
                    <span ref={roleRef} aria-hidden="true">{ROLES[0]}</span>
                </span>
            </p>
        </div>

        {/* Details framing the bottom edge, like the credits on a film still */}
        <div
            ref={detailsRef}
            className="absolute inset-x-0 bottom-0 grid grid-cols-2 items-end gap-6 px-6 pb-8 text-left sm:grid-cols-3 md:px-10 md:pb-10 lg:px-12"
        >
            <HeroDetail label="Based in">
                Vancouver, Canada · <span className="whitespace-nowrap"><LocalTime /></span>
            </HeroDetail>
            <div className="justify-self-end sm:justify-self-center">
                <ScrollCue />
            </div>
            <div className="hidden justify-self-end text-right sm:block">
                <HeroDetail label="Currently">
                    Software Developer at STEMCELL Technologies
                </HeroDetail>
            </div>
        </div>
    </section>
    );
}

export default HeroTitle;
