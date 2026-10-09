import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_LINKS as links } from "./navLinks";
import { lockScroll, scrollToHash, unlockScroll } from "../lib/smoothScroll";

// Smooth, "settling" curve for things entering; quicker, softer curve for things leaving
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

// One shared fade for the light/dark switch; the logo, links and icon inherit the header's colour so they move together
const THEME_TRANSITION = { transitionDuration: "500ms", transitionTimingFunction: EASE_IN_OUT };

// Sections with a dark background; the navbar inverts while one sits underneath it
const DARK_SECTIONS = ["#contact"];

function Navbar(){
    const [isOpen, setIsOpen] = useState(false);
    const [overDark, setOverDark] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    // The open menu is white, so the bar stays light on top of it
    const isDark = overDark && !isOpen;

    // Lock page scroll while the full-screen menu is open, and close it on Escape
    useEffect(() => {
        if (!isOpen) return;

        lockScroll();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            unlockScroll();
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    // Close the menu if the screen is resized up to the desktop layout
    useEffect(() => {
        const mql = window.matchMedia("(min-width: 768px)");
        const onChange = (e: MediaQueryListEvent) => {
            if (e.matches) setIsOpen(false);
        };
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    // Invert while a dark section sits under the middle of the navbar, so the switch lands as the section's edge
    // passes behind the bar. ScrollTrigger only reports crossings, rather than measuring on every scroll event.
    useEffect(() => {
        const edge = () => (headerRef.current?.offsetHeight ?? 0) / 2;
        const active = new Set<string>();
        const triggers = DARK_SECTIONS.map((selector) =>
            ScrollTrigger.create({
                trigger: selector,
                start: () => `top ${edge()}`,
                end: () => `bottom ${edge()}`,
                onToggle: (self) => {
                    if (self.isActive) active.add(selector);
                    else active.delete(selector);
                    setOverDark(active.size > 0);
                },
            }),
        );
        return () => triggers.forEach((t) => t.kill());
    }, []);

    // Close the menu first, then scroll once the body scroll lock has been released,
    // so the page glides to the section while the menu fades away
    const handleMenuLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);
        requestAnimationFrame(() => scrollToHash(href));
    };

    return(
        <>
            <header
                ref={headerRef}
                style={THEME_TRANSITION}
                className={`fixed inset-x-0 top-0 z-50 backdrop-blur transition-colors motion-reduce:transition-none ${
                    isDark ? "bg-neutral-950/80 text-white" : "bg-white/80 text-black"
                }`}
            >
                <nav className="flex items-center justify-between px-6 py-5 md:px-10 lg:px-12">
                    <a
                        href="#top"
                        onClick={() => setIsOpen(false)}
                        className="relative z-50 text-lg font-bold tracking-tight"
                    >
                        Aditya Padmarajan
                    </a>

                    <ul className="hidden items-center gap-10 md:flex">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="text-sm font-medium opacity-70 transition-opacity hover:opacity-100"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Two-stage morph: bars slide together, then rotate into an X (and the reverse on close) */}
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
                    >
                        <span
                            style={{
                                transitionTimingFunction: EASE_IN_OUT,
                                transitionDelay: isOpen ? "0ms, 150ms" : "150ms, 0ms",
                            }}
                            className={`block h-0.5 w-6 bg-current transition-[translate,rotate] duration-200 motion-reduce:transition-none ${
                                isOpen ? "translate-y-2 rotate-45" : ""
                            }`}
                        />
                        <span
                            style={{
                                transitionTimingFunction: EASE_IN_OUT,
                                transitionDelay: isOpen ? "0ms" : "150ms",
                            }}
                            className={`block h-0.5 w-6 bg-current transition-opacity duration-150 motion-reduce:transition-none ${
                                isOpen ? "opacity-0" : ""
                            }`}
                        />
                        <span
                            style={{
                                transitionTimingFunction: EASE_IN_OUT,
                                transitionDelay: isOpen ? "0ms, 150ms" : "150ms, 0ms",
                            }}
                            className={`block h-0.5 w-6 bg-current transition-[translate,rotate] duration-200 motion-reduce:transition-none ${
                                isOpen ? "-translate-y-2 -rotate-45" : ""
                            }`}
                        />
                    </button>
                </nav>
            </header>

            {/* On close the links leave first (in reverse order), then the backdrop fades out behind them */}
            <div
                id="mobile-menu"
                inert={!isOpen}
                style={{
                    transitionTimingFunction: isOpen ? EASE_OUT : EASE_IN_OUT,
                    transitionDuration: isOpen ? "400ms" : "300ms",
                    transitionDelay: isOpen ? "0ms" : "100ms",
                }}
                className={`fixed inset-0 z-40 flex h-dvh flex-col items-center justify-center bg-white transition-[opacity,visibility] motion-reduce:transition-none md:hidden ${
                    isOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
            >
                <ul className="flex flex-col items-center gap-10">
                    {links.map((link, i) => (
                        <li
                            key={link.href}
                            style={{
                                transitionTimingFunction: isOpen ? EASE_OUT : EASE_IN_OUT,
                                transitionDuration: isOpen ? "600ms" : "200ms",
                                transitionDelay: isOpen
                                    ? `${150 + i * 70}ms`
                                    : `${(links.length - 1 - i) * 40}ms`,
                            }}
                            className={`transition-[translate,opacity] will-change-[translate,opacity] motion-reduce:transition-none ${
                                isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                            }`}
                        >
                            <a
                                href={link.href}
                                onClick={(e) => handleMenuLinkClick(e, link.href)}
                                className="text-4xl font-extrabold tracking-tight text-black"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Navbar;
