import type { ReactNode } from "react";

// A small uppercase label over a single line, for the bar along the bottom of the Contact section
function FooterItem({ label, children }: { label: string; children: ReactNode }){
    return(
        <div>
            <h3 className="text-xs font-medium tracking-widest text-white/40 uppercase">
                {label}
            </h3>
            <div className="mt-3 text-sm text-white sm:mt-4 sm:text-base">
                {children}
            </div>
        </div>
    );
}

export default FooterItem;
