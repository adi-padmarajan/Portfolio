import { useId } from "react";
import type { Ref } from "react";

// The ring a mug leaves on paper: darkest along the outer edge where the coffee dried, faint inside, and never
// quite round. Purely decorative.
function CoffeeRing({ ringRef, className = "" }: { ringRef?: Ref<SVGSVGElement>; className?: string }){
    const id = useId();
    return(
        <svg ref={ringRef} viewBox="0 0 200 200" aria-hidden="true" className={`pointer-events-none ${className}`}>
            <defs>
                {/* Roughen every edge a little, the way a stain soaks into paper */}
                <filter id={`${id}-soak`} x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
                    <feDisplacementMap in="SourceGraphic" scale="7" />
                    <feGaussianBlur stdDeviation="0.6" />
                </filter>
            </defs>
            <g filter={`url(#${id}-soak)`} fill="none" stroke="#6b3d1c">
                <circle cx="100" cy="100" r="78" fill="#6b3d1c" fillOpacity="0.05" stroke="none" />
                <circle cx="100" cy="100" r="80" strokeWidth="7" strokeOpacity="0.35" />
                <circle cx="100" cy="100" r="83.5" strokeWidth="1.6" strokeOpacity="0.7" />
                {/* Where the mug was set down slightly off, a second fainter arc */}
                <path d="M30 118 A74 74 0 0 0 150 162" strokeWidth="2" strokeOpacity="0.25" />
                {/* A single drip that ran down the side */}
                <circle cx="168" cy="146" r="4" fill="#6b3d1c" fillOpacity="0.3" stroke="none" />
            </g>
        </svg>
    );
}

export default CoffeeRing;
