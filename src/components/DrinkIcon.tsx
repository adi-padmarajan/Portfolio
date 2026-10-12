import { useId } from "react";
import type { Ref } from "react";
import type { DrinkId } from "../lib/coffeeOrder";

// Every drink is drawn from above in a 100-unit square, lit from the top left like the hero's cup
const C = 50;

// Fixed flecks of cocoa on a cappuccino, so the dusting looks the same every time it's drawn
const COCOA = Array.from({ length: 42 }, (_, i) => {
    const angle = i * 2.399963; // the golden angle spreads them evenly without looking like a grid
    const reach = 4 + Math.sqrt(i / 42) * 15;
    return { x: C + Math.cos(angle) * reach, y: C + Math.sin(angle) * reach, r: 0.55 + ((i * 7) % 5) * 0.12 };
});

type DrinkIconProps = {
    drink: DrinkId;
    // How full it is, from 0 to 1; the surface shrinks towards the middle as it's drunk
    level?: number;
    // The circle the surface is clipped to, for anything that drains it frame by frame without re-rendering
    surfaceRef?: Ref<SVGCircleElement>;
    className?: string;
};

// A small cup of the visitor's drink, seen from above: black coffee, an espresso with its crema, a latte with a
// heart poured in, a cappuccino dusted with cocoa, or an iced coffee in a glass with ice and a straw
function DrinkIcon({ drink, level = 1, surfaceRef, className = "" }: DrinkIconProps){
    const id = useId();
    const espresso = drink === "espresso";
    const iced = drink === "iced";
    // An espresso comes in a smaller cup on a smaller saucer
    const saucer = espresso ? 40 : 47;
    const body = espresso ? 26 : 34;
    const wall = espresso ? 23 : 30;
    const surface = (espresso ? 21 : 27) * Math.max(0, Math.min(1, level));

    return(
        <svg viewBox="0 0 100 100" aria-hidden="true" className={`block overflow-visible ${className}`}>
            <defs>
                <linearGradient id={`${id}-wall`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
                    <stop offset="0%" stopColor="#cfcac4" />
                    <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <radialGradient id={`${id}-black`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2a170c" />
                    <stop offset="80%" stopColor="#1f1008" />
                    <stop offset="100%" stopColor="#6b3d1c" />
                </radialGradient>
                {/* Crema: golden in the middle, darkening to a tiger-striped rim */}
                <radialGradient id={`${id}-crema`} cx="46%" cy="44%" r="55%">
                    <stop offset="0%" stopColor="#d6a06a" />
                    <stop offset="55%" stopColor="#b07440" />
                    <stop offset="100%" stopColor="#5e3416" />
                </radialGradient>
                <radialGradient id={`${id}-latte`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#d8b48b" />
                    <stop offset="85%" stopColor="#c39668" />
                    <stop offset="100%" stopColor="#8f5f35" />
                </radialGradient>
                <radialGradient id={`${id}-foam`} cx="45%" cy="42%" r="58%">
                    <stop offset="0%" stopColor="#fffaf2" />
                    <stop offset="80%" stopColor="#f1e6d6" />
                    <stop offset="100%" stopColor="#c9a983" />
                </radialGradient>
                <radialGradient id={`${id}-iced`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3d2313" />
                    <stop offset="80%" stopColor="#2c180b" />
                    <stop offset="100%" stopColor="#7a4a25" />
                </radialGradient>
                <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="0.8" />
                </filter>
                <clipPath id={`${id}-surface`}>
                    <circle ref={surfaceRef} cx={C} cy={C} r={surface} />
                </clipPath>
            </defs>

            {iced ? (
                <>
                    {/* A glass, with no saucer: a frosted rim and the light catching its edge */}
                    <circle cx={C} cy={C} r={36} fill="#eef3f6" fillOpacity={0.9} stroke="#c3ccd3" strokeWidth={1} />
                    <circle cx={C} cy={C} r={32} fill="#ffffff" fillOpacity={0.6} stroke="#dde4e9" strokeWidth={0.8} />
                </>
            ) : (
                <>
                    {/* Saucer (its hairline keeps it crisp on dark backgrounds too), handle, cup and its inner wall */}
                    <circle cx={C} cy={C} r={saucer} fill="#ffffff" stroke="#d8d4cf" strokeWidth={1} />
                    <rect
                        x={C + body - 8}
                        y={C - 6}
                        width={espresso ? 14 : 18}
                        height={12}
                        rx={6}
                        transform={`rotate(-35 ${C} ${C})`}
                        fill="#ffffff"
                        stroke="#d8d4cf"
                        strokeWidth={1}
                    />
                    <circle cx={C} cy={C} r={body} fill="#ffffff" stroke="#d8d4cf" strokeWidth={1} />
                    <circle cx={C} cy={C} r={wall} fill={`url(#${id}-wall)`} />
                </>
            )}

            <g clipPath={`url(#${id}-surface)`}>
                {drink === "black" && <circle cx={C} cy={C} r={27} fill={`url(#${id}-black)`} />}

                {espresso && (
                    <>
                        <circle cx={C} cy={C} r={21} fill={`url(#${id}-crema)`} />
                        {/* The darker flecks that streak through good crema */}
                        <g fill="#5e3416" opacity={0.45} filter={`url(#${id}-soft)`}>
                            <ellipse cx={C - 9} cy={C + 6} rx={5} ry={2} transform={`rotate(30 ${C - 9} ${C + 6})`} />
                            <ellipse cx={C + 8} cy={C - 8} rx={4} ry={1.6} transform={`rotate(-40 ${C + 8} ${C - 8})`} />
                            <ellipse cx={C + 10} cy={C + 9} rx={3.5} ry={1.4} transform={`rotate(60 ${C + 10} ${C + 9})`} />
                        </g>
                    </>
                )}

                {drink === "latte" && (
                    <>
                        <circle cx={C} cy={C} r={27} fill={`url(#${id}-latte)`} />
                        {/* A heart poured into the milk */}
                        <path
                            d={`M${C} ${C + 12} C${C - 4} ${C + 8} ${C - 14} ${C + 2} ${C - 13} ${C - 5} C${C - 12} ${C - 12} ${C - 4} ${C - 13} ${C} ${C - 6} C${C + 4} ${C - 13} ${C + 12} ${C - 12} ${C + 13} ${C - 5} C${C + 14} ${C + 2} ${C + 4} ${C + 8} ${C} ${C + 12} Z`}
                            fill="#fbf6ef"
                            filter={`url(#${id}-soft)`}
                        />
                    </>
                )}

                {drink === "cappuccino" && (
                    <>
                        <circle cx={C} cy={C} r={27} fill={`url(#${id}-foam)`} />
                        <g fill="#6b3d1c" opacity={0.75}>
                            {COCOA.map((fleck, i) => <circle key={i} cx={fleck.x} cy={fleck.y} r={fleck.r} />)}
                        </g>
                    </>
                )}

                {iced && (
                    <>
                        <circle cx={C} cy={C} r={30} fill={`url(#${id}-iced)`} />
                        {/* Ice cubes bobbing at the surface */}
                        <g fill="#ffffff" fillOpacity={0.55} stroke="#ffffff" strokeOpacity={0.85} strokeWidth={0.8}>
                            <rect x={C - 15} y={C - 12} width={11} height={11} rx={2.5} transform={`rotate(-15 ${C - 10} ${C - 7})`} />
                            <rect x={C + 2} y={C - 4} width={10} height={10} rx={2.5} transform={`rotate(20 ${C + 7} ${C + 1})`} />
                            <rect x={C - 8} y={C + 6} width={9} height={9} rx={2.5} transform={`rotate(8 ${C - 4} ${C + 10})`} />
                        </g>
                    </>
                )}
            </g>

            {/* An iced coffee's straw leans out over the rim */}
            {iced && level > 0.05 && (
                <g transform={`rotate(-40 ${C} ${C})`}>
                    <rect x={C + 3} y={C - 2.5} width={44} height={5} rx={2.5} fill="#111111" />
                    <circle cx={C + 3} cy={C} r={2.5} fill="#444444" />
                </g>
            )}
        </svg>
    );
}

export default DrinkIcon;
