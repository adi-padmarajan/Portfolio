import type { ReactNode } from "react";

// A small uppercase label over a single line, for the details framing the bottom of the hero
function HeroDetail({ label, children }: { label: string; children: ReactNode }){
    return(
        <div>
            <p className="text-[0.625rem] font-medium tracking-widest text-gray-400 uppercase sm:text-xs">
                {label}
            </p>
            <div className="mt-1.5 text-xs text-black sm:mt-2 sm:text-sm">
                {children}
            </div>
        </div>
    );
}

export default HeroDetail;
