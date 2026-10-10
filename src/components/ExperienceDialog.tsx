import { Fragment, useId, useLayoutEffect, useRef } from "react";
import type { KeyboardEvent, SyntheticEvent } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../lib/motion";
import { lockScroll, unlockScroll } from "../lib/smoothScroll";
import type { Experience } from "./experiences";

// "01", "02", ... so the counters line up
const pad = (n: number) => String(n).padStart(2, "0");

// Set the **marked** words in black; the rest of the line recedes in grey, as in the About statement
function Emphasis({ text }: { text: string }){
    return text.split("**").map((part, i) =>
        i % 2 ? <span key={i} className="text-black">{part}</span> : <Fragment key={i}>{part}</Fragment>,
    );
}

// The full story behind one role. A native modal dialog gives focus trapping, Escape and the top layer for free;
// GSAP only handles the motion. On phones the panel rises as a bottom sheet, on larger screens it floats centred.
function ExperienceDialog({
    experiences,
    index,
    onNavigate,
    onClose,
}: {
    experiences: Experience[];
    index: number | null;
    onNavigate: (index: number) => void;
    onClose: () => void;
}){
    const dialogRef = useRef<HTMLDialogElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const closingRef = useRef(false);
    const prevIndexRef = useRef<number | null>(null);
    const titleId = useId();

    const isOpen = index !== null;
    const experience = isOpen ? experiences[index] : null;

    // Open: hold the page still, fade the backdrop in and let the panel rise into place. Only opacity is animated,
    // never visibility, so the close button keeps the focus the dialog gives it on opening.
    useLayoutEffect(() => {
        const dialog = dialogRef.current;
        if (!isOpen || !dialog) return;

        dialog.showModal();
        lockScroll();
        closingRef.current = false;

        const targets = [overlayRef.current, panelRef.current];
        const tl = prefersReducedMotion()
            ? null
            : gsap.timeline()
                .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" })
                .fromTo(panelRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, 0.05);

        return () => {
            tl?.kill();
            gsap.set(targets, { clearProps: "opacity,transform" });
            dialog.close();
            unlockScroll();
        };
    }, [isOpen]);

    // Moving between roles: start the new one from the top and slide it in from the side it came from
    useLayoutEffect(() => {
        const prev = prevIndexRef.current;
        prevIndexRef.current = index;
        if (index === null || prev === null || prev === index) return;

        scrollRef.current?.scrollTo({ top: 0 });
        // Reaching either end removes the button that was just pressed; keep the focus inside the dialog
        if (!dialogRef.current?.contains(document.activeElement)) closeButtonRef.current?.focus();
        if (prefersReducedMotion()) return;

        const direction = index > prev ? 1 : -1;
        const tween = gsap.fromTo(
            contentRef.current,
            { x: 32 * direction, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        );
        return () => {
            tween.kill();
        };
    }, [index]);

    // Close: the panel sinks away, then the backdrop clears, and only then is the dialog actually closed
    const requestClose = () => {
        if (closingRef.current) return;
        if (prefersReducedMotion()) {
            onClose();
            return;
        }

        closingRef.current = true;
        gsap.timeline({ onComplete: onClose, defaults: { overwrite: "auto" } })
            .to(panelRef.current, { y: 40, opacity: 0, duration: 0.35, ease: "power2.in" })
            .to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 0.1);
    };

    // Escape asks to close; take it over so the exit can animate
    const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        requestClose();
    };

    // The browser can still force the dialog shut (e.g. Escape pressed twice), so keep the state in step
    const handleNativeClose = () => {
        if (isOpen && !dialogRef.current?.open) onClose();
    };

    const hasPrev = isOpen && index > 0;
    const hasNext = isOpen && index < experiences.length - 1;

    const handleKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
        if (!isOpen) return;
        if (e.key === "ArrowLeft" && hasPrev) onNavigate(index - 1);
        if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
    };

    return(
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onCancel={handleCancel}
            onClose={handleNativeClose}
            onKeyDown={handleKeyDown}
            className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-transparent"
        >
            <div
                ref={overlayRef}
                aria-hidden="true"
                onClick={requestClose}
                className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm"
            />

            {/* Clicks around the panel fall through to the backdrop, which closes it */}
            <div className="pointer-events-none relative flex h-full items-end justify-center sm:items-center sm:p-6">
                <div
                    ref={panelRef}
                    className="pointer-events-auto flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white text-black shadow-2xl sm:max-h-[88dvh] sm:rounded-3xl"
                >
                    {experience && (
                        <>
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sm:px-10 sm:py-5">
                                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase tabular-nums">
                                    Experience {pad(index! + 1)} / {pad(experiences.length)}
                                </p>
                                <button
                                    ref={closeButtonRef}
                                    type="button"
                                    onClick={requestClose}
                                    aria-label="Close details"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-colors duration-300 hover:border-black hover:bg-black hover:text-white"
                                >
                                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
                                        <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Lenis is paused while the dialog is open and would swallow the wheel, so this area scrolls natively */}
                            <div
                                ref={scrollRef}
                                data-lenis-prevent
                                className="flex-1 overflow-y-auto overscroll-contain px-6 py-10 sm:px-10 sm:py-12"
                            >
                                <div ref={contentRef}>
                                    <p className="text-sm text-gray-400">
                                        {experience.period}
                                        <span aria-hidden="true" className="mx-2">·</span>
                                        {experience.location}
                                    </p>
                                    <h3
                                        id={titleId}
                                        className="mt-4 text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl"
                                    >
                                        {experience.company}
                                    </h3>
                                    <p className="mt-3 text-lg text-gray-500 sm:text-xl">{experience.role}</p>

                                    <p className="mt-10 text-xl leading-snug font-medium tracking-tight sm:mt-12 sm:text-2xl">
                                        {experience.summary}
                                    </p>

                                    <h4 className="mt-12 text-xs font-medium tracking-widest text-gray-400 uppercase sm:mt-14">
                                        Highlights
                                    </h4>
                                    <ol className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
                                        {experience.highlights.map((highlight, i) => (
                                            <li key={highlight} className="flex gap-5 py-5 sm:gap-8">
                                                <span className="pt-1 text-xs text-gray-400 tabular-nums">{pad(i + 1)}</span>
                                                <p className="text-base leading-relaxed text-gray-500 sm:text-lg">
                                                    <Emphasis text={highlight} />
                                                </p>
                                            </li>
                                        ))}
                                    </ol>

                                    <h4 className="mt-12 text-xs font-medium tracking-widest text-gray-400 uppercase sm:mt-14">
                                        Stack
                                    </h4>
                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {experience.stack.map((tool) => (
                                            <li key={tool} className="rounded-full border border-gray-200 px-4 py-2 text-sm">
                                                {tool}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Step through the roles without closing; the arrow keys do the same */}
                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 px-6 py-4 sm:px-10 sm:py-5">
                                {hasPrev ? (
                                    <button
                                        type="button"
                                        onClick={() => onNavigate(index! - 1)}
                                        className="group min-w-0 text-left"
                                    >
                                        <span className="block text-xs text-gray-400">← Previous</span>
                                        <span className="block truncate text-sm font-medium transition-opacity group-hover:opacity-60 sm:text-base">
                                            {experiences[index! - 1].company}
                                        </span>
                                    </button>
                                ) : <span />}
                                {hasNext && (
                                    <button
                                        type="button"
                                        onClick={() => onNavigate(index! + 1)}
                                        className="group min-w-0 text-right"
                                    >
                                        <span className="block text-xs text-gray-400">Next →</span>
                                        <span className="block truncate text-sm font-medium transition-opacity group-hover:opacity-60 sm:text-base">
                                            {experiences[index! + 1].company}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </dialog>
    );
}

export default ExperienceDialog;
