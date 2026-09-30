import { useEffect, useState } from "react";

const links = [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
];

function Navbar(){
    const [isOpen, setIsOpen] = useState(false);

    // Lock page scroll while the full-screen menu is open, and close it on Escape
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = "";
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

    return(
        <>
            <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <a
                        href="#top"
                        onClick={() => setIsOpen(false)}
                        className="relative z-50 text-lg font-bold tracking-tight text-black"
                    >
                        Aditya Padmarajan
                    </a>

                    <ul className="hidden items-center gap-10 md:flex">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="text-sm font-medium text-black/70 transition-colors hover:text-black"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
                    >
                        <span
                            className={`block h-0.5 w-6 bg-black transition-transform duration-300 ${
                                isOpen ? "translate-y-2 rotate-45" : ""
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-6 bg-black transition-opacity duration-300 ${
                                isOpen ? "opacity-0" : ""
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-6 bg-black transition-transform duration-300 ${
                                isOpen ? "-translate-y-2 -rotate-45" : ""
                            }`}
                        />
                    </button>
                </nav>
            </header>

            <div
                id="mobile-menu"
                className={`fixed inset-0 z-40 flex h-dvh flex-col items-center justify-center bg-white transition-all duration-300 md:hidden ${
                    isOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
            >
                <ul className="flex flex-col items-center gap-10">
                    {links.map((link, i) => (
                        <li
                            key={link.href}
                            style={{ transitionDelay: isOpen ? `${100 + i * 75}ms` : "0ms" }}
                            className={`transition-all duration-500 ${
                                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                        >
                            <a
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                tabIndex={isOpen ? 0 : -1}
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
