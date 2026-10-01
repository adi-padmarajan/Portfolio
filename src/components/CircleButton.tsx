import type { ReactNode } from "react";

// A round black link button that grows slightly on hover
function CircleButton({ href, children }: { href: string; children: ReactNode }){
    return(
        <a
            href={href}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-black text-sm font-medium text-white transition-transform duration-300 hover:scale-105 sm:h-36 sm:w-36 sm:text-base"
        >
            {children}
        </a>
    );
}

export default CircleButton;
