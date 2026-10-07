import type { ReactNode } from "react";

// Shared outline for the pill-shaped links and buttons in the Contact section
export const PILL_CLASSES =
    "inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-4 text-sm text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black sm:px-10 sm:py-6 sm:text-lg";

function PillLink({ href, children }: { href: string; children: ReactNode }){
    return(
        <a href={href} className={PILL_CLASSES}>
            {children}
        </a>
    );
}

export default PillLink;
