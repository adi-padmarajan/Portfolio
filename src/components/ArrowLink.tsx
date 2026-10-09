import type { ReactNode } from "react";

// An understated in-page link: an underline that draws in on hover, and an arrow that nudges forward
function ArrowLink({ href, children }: { href: string; children: ReactNode }){
    return(
        <a
            href={href}
            className="group inline-flex items-center gap-3 text-base font-medium text-black sm:text-lg"
        >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:100%_1px]">
                {children}
            </span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
            </span>
        </a>
    );
}

export default ArrowLink;
