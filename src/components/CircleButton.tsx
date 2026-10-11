import type { ReactNode } from "react";

const VARIANTS = {
    dark: "bg-black text-white focus-visible:outline-black",
    light: "bg-white text-black focus-visible:outline-white",
};

const SIZES = {
    md: "h-24 w-24 text-sm sm:h-36 sm:w-36 sm:text-base",
    lg: "h-28 w-28 text-sm sm:h-40 sm:w-40 sm:text-base lg:h-48 lg:w-48 lg:text-lg",
};

type CircleButtonProps = {
    children: ReactNode;
    variant?: keyof typeof VARIANTS;
    size?: keyof typeof SIZES;
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

// A round button that grows slightly on hover; light and large versions sit on the dark Contact section.
// It's a link when given an href, and a plain button when given an onClick.
function CircleButton({ href, onClick, children, variant = "dark", size = "md" }: CircleButtonProps){
    const className = `flex items-center justify-center rounded-full font-medium transition-transform duration-300 hover:scale-105 ${VARIANTS[variant]} ${SIZES[size]}`;

    if (href !== undefined) {
        return <a href={href} className={className}>{children}</a>;
    }
    return <button type="button" onClick={onClick} className={`cursor-pointer ${className}`}>{children}</button>;
}

export default CircleButton;
