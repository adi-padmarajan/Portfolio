import type { ReactNode } from "react";

// One column of the facts row: a hairline that draws across, then a small label over a line or two of plain text.
// The rule and the content are tagged so About can animate them separately.
function AboutFact({ label, children }: { label: string; children: ReactNode }){
    return(
        <div>
            <span data-fact-rule aria-hidden="true" className="block h-px w-full origin-left bg-gray-200" />
            <div data-fact-content className="pt-6 sm:pt-8">
                <h3 className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                    {label}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-black sm:mt-4 sm:text-lg">
                    {children}
                </p>
            </div>
        </div>
    );
}

export default AboutFact;
