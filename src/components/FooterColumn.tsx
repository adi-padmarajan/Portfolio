import type { ReactNode } from "react";

// A small uppercase label over a short stack of links or lines, like InfoBlock
function FooterColumn({ label, children }: { label: string; children: ReactNode }){
    return(
        <div>
            <h3 className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                {label}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-black sm:mt-4 sm:text-base">
                {children}
            </ul>
        </div>
    );
}

export default FooterColumn;
