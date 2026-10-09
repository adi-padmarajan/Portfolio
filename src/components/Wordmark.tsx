import type { Ref } from "react";
import { WORDMARK_HEIGHT, WORDMARK_WIDTH } from "./wordmarkGeometry";

// "Adi" drawn as a heavy geometric wordmark. Drawing it (rather than setting it in a font) pins the d's counter
// to exact coordinates, so the hero can zoom precisely into it, and keeps every edge crisp at any scale.
function Wordmark({ letterRef }: { letterRef?: Ref<SVGGElement> }){
    return(
        <svg
            viewBox={`0 0 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`}
            fill="currentColor"
            fillRule="evenodd"
            className="block h-auto w-full"
        >
            {/* Each letter is a separate path, so they can rise one after another; the SVG's edge masks them */}
            <g ref={letterRef}>
                <path d="M0 100 L30 0 L54 0 L84 100 L64 100 L58 80 L26 80 L20 100 Z M30.8 64 L53.2 64 L42 26.667 Z" />
                {/* d: stem, round bowl and oval counter. Nonzero winding (the counter runs the other way) lets the
                    bowl merge into the stem while still punching the hole */}
                <path
                    transform="translate(82 0)"
                    fillRule="nonzero"
                    d="M52 0 H72 V100 H52 Z M0 64 A36 36 0 1 1 72 64 A36 36 0 1 1 0 64 Z M20 64 A16 20 0 1 0 52 64 A16 20 0 1 0 20 64 Z"
                />
                {/* i: round dot over a stem that rises to the x-height */}
                <path transform="translate(170 0)" d="M0 10 A10 10 0 1 1 20 10 A10 10 0 1 1 0 10 Z M0 28 H20 V100 H0 Z" />
            </g>
        </svg>
    );
}

export default Wordmark;
