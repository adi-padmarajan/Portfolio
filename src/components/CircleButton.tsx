import type { ReactNode } from "react";

const VARIANTS = {
    dark: "bg-black text-white",
    light: "bg-white text-black",
};

const SIZES = {
    md: "h-24 w-24 text-sm sm:h-36 sm:w-36 sm:text-base",
    lg: "h-28 w-28 text-sm sm:h-40 sm:w-40 sm:text-base lg:h-48 lg:w-48 lg:text-lg",
};

// A round link button that grows slightly on hover; light and large versions sit on the dark Contact section
function CircleButton({
    href,
    children,
    variant = "dark",
    size = "md",
}: {
    href: string;
    children: ReactNode;
    variant?: keyof typeof VARIANTS;
    size?: keyof typeof SIZES;
}){
    return(
        <a
            href={href}
            className={`flex items-center justify-center rounded-full font-medium transition-transform duration-300 hover:scale-105 ${VARIANTS[variant]} ${SIZES[size]}`}
        >
            {children}
        </a>
    );
}

export default CircleButton;
