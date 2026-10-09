import type { Ref } from "react";
import { WORDMARK_HEIGHT, WORDMARK_WIDTH } from "./wordmarkGeometry";

// "ADI" drawn as a heavy geometric wordmark. Drawing it (rather than setting it in a font) pins the A's counter
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
                <path
                    transform="translate(90 0)"
                    d="M0 0 H32 C56 0 70 18 70 50 C70 82 56 100 32 100 H0 Z M20 20 H31 C44 20 50 32 50 50 C50 68 44 80 31 80 H20 Z"
                />
                <path transform="translate(170 0)" d="M0 0 H20 V100 H0 Z" />
            </g>
        </svg>
    );
}

export default Wordmark;
