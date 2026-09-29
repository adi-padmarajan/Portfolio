import { useState } from "react";

const links = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
    { href: "#marathons", label: "Marathons" },
    { href: "#resume", label: "Resume" },
];

function Navbar(){
    const [isOpen, setIsOpen] = useState(false);

    return(
        <nav className="relative flex items-center justify-between p-4 bg-white shadow-md">
            <div className="text-xl font-bold text-black">Aditya Padmarajan</div>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="nav-menu"
                className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
            >
                <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isOpen ? "translate-y-2 rotate-45" : ""}`}></span>
                <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
                <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}></span>
            </button>
            {isOpen && (
                <div id="nav-menu" className="absolute right-4 top-full mt-2 flex flex-col w-48 bg-white shadow-md">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-700"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
