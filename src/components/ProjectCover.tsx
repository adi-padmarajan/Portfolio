import { useId } from "react";
import type { CSSProperties } from "react";
import type { ProjectCoverKind } from "./projects";

// Rotate and scale SVG groups about their own centre rather than the canvas corner
const SELF_ORIGIN: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };

const FAINT = "rgb(255 255 255 / 0.12)";

// Deterministic scatter, so the clusters land in the same place on every render
function seeded(seed: number){
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const CLUSTERS = (() => {
    const rand = seeded(7);
    const centres = [
        { x: 120, y: 110, spread: 38, opacity: 1 },
        { x: 270, y: 90, spread: 30, opacity: 0.55 },
        { x: 230, y: 205, spread: 42, opacity: 0.35 },
        { x: 95, y: 215, spread: 24, opacity: 0.2 },
    ];
    return centres.map((c, i) => ({
        ...c,
        accent: i === 0,
        dots: Array.from({ length: 34 }, () => {
            // Box–Muller for a soft, roughly circular cloud
            const r = Math.sqrt(-2 * Math.log(rand() || 1e-6)) * c.spread * 0.5;
            const a = rand() * Math.PI * 2;
            return { x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a), r: 1.6 + rand() * 2.2 };
        }),
    }));
})();

// CareRide: a ride travelling across a street grid, from pickup to drop-off
function Route({ accent }: { accent: string }){
    const path = "M70 225 C150 225 130 135 205 140 S290 75 330 78";
    return(
        <>
            {[60, 120, 180, 240].map((y) => <path key={y} d={`M0 ${y}H400`} stroke={FAINT} />)}
            {[80, 160, 240, 320].map((x) => <path key={x} d={`M${x} 0V300`} stroke={FAINT} />)}
            <path d={path} fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="10" strokeLinecap="round" />
            <path
                d={path}
                fill="none"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="2 12"
                className="motion-safe:animate-route-dash group-hover:[animation-duration:0.8s]"
            />
            <circle cx="70" cy="225" r="7" fill="white" />
            <circle cx="70" cy="225" r="14" fill="none" stroke="white" strokeOpacity="0.3" />
            <g transform="translate(330 78)">
                <path d="M0 0c-9-11-14-18-14-25a14 14 0 0128 0c0 7-5 14-14 25z" fill={accent} />
                <circle cy="-25" r="5" fill="#0a0a0a" />
            </g>
        </>
    );
}

// SpideyIRL: eight sensors around the head; the one facing an obstacle tingles
function Sense({ accent }: { accent: string }){
    const sensors = Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 - Math.PI / 2;
        return { x: Math.cos(a) * 78, y: Math.sin(a) * 78, active: i === 1 };
    });
    const active = sensors[1];
    return(
        <g transform="translate(200 150)">
            <circle r="110" fill="none" stroke={FAINT} />
            <circle r="78" fill="none" stroke="rgb(255 255 255 / 0.2)" strokeDasharray="2 6" />
            {sensors.map((s, i) => (
                <path key={i} d={`M0 0L${s.x} ${s.y}`} stroke={FAINT} />
            ))}
            <circle r="34" fill="#0a0a0a" stroke="white" strokeWidth="2" />
            {/* A notch marks the front of the head */}
            <path d="M-6 -27l6 -7 6 7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {[0, 0.8, 1.6].map((delay) => (
                <circle
                    key={delay}
                    cx={active.x}
                    cy={active.y}
                    r="18"
                    fill="none"
                    stroke={accent}
                    strokeWidth="1.5"
                    style={{ ...SELF_ORIGIN, animationDelay: `${delay}s` }}
                    className="opacity-0 motion-safe:animate-sense-ping motion-reduce:opacity-40"
                />
            ))}
            {sensors.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.active ? 7 : 5} fill={s.active ? accent : "white"} />
            ))}
            <rect x="112" y="-128" width="26" height="26" rx="4" fill="none" stroke="white" strokeOpacity="0.5" />
        </g>
    );
}

// Pulse: a sweeping radar with people blipping into range
function Radar({ accent }: { accent: string }){
    const blips = [
        { x: 46, y: -62, r: 6 },
        { x: -84, y: 30, r: 5 },
        { x: 70, y: 58, r: 4 },
        { x: -30, y: -100, r: 3.5 },
    ];
    // Gradient ids are document-wide, so keep each radar's unique (and free of characters url() would trip on)
    const gradientId = useId().replace(/[^\w-]/g, "");
    return(
        <g transform="translate(200 150)">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={accent} stopOpacity="0" />
                    <stop offset="1" stopColor={accent} stopOpacity="0.45" />
                </linearGradient>
            </defs>
            {[40, 80, 120].map((r) => <circle key={r} r={r} fill="none" stroke="rgb(255 255 255 / 0.18)" />)}
            <path d="M-130 0H130M0 -130V130" stroke={FAINT} />

            <g style={SELF_ORIGIN} className="motion-safe:animate-radar-sweep group-hover:[animation-duration:2.5s]">
                {/* An invisible ring keeps the group's box centred, so it spins about the middle */}
                <circle r="120" fill="none" />
                <path d="M0 0L120 0A120 120 0 0 0 84.85 -84.85Z" fill={`url(#${gradientId})`} />
                <path d="M0 0L120 0" stroke={accent} strokeWidth="2" />
            </g>

            {blips.map((b, i) => (
                <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={i === 0 ? accent : "white"} />
            ))}
            <circle r="5" fill="white" />
        </g>
    );
}

// Upopolis: engagement data settling into cohorts, as on a UMAP projection
function Clusters({ accent }: { accent: string }){
    return(
        <>
            <path d="M40 260H360M40 260V40" stroke="rgb(255 255 255 / 0.2)" />
            {CLUSTERS.map((cluster, i) => (
                <g
                    key={i}
                    style={{ animationDelay: `${i * -1.5}s` }}
                    className="motion-safe:animate-cluster-drift"
                >
                    {cluster.dots.map((d, j) => (
                        <circle
                            key={j}
                            cx={d.x}
                            cy={d.y}
                            r={d.r}
                            fill={cluster.accent ? accent : "white"}
                            fillOpacity={cluster.opacity}
                        />
                    ))}
                </g>
            ))}
        </>
    );
}

const COVERS = { route: Route, sense: Sense, radar: Radar, clusters: Clusters };

// A small, drawn illustration of each project, so the grid stays consistent without screenshots.
// Purely decorative; the card's text carries the meaning.
function ProjectCover({ kind, accent }: { kind: ProjectCoverKind; accent: string }){
    const Cover = COVERS[kind];
    return(
        <svg
            aria-hidden="true"
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        >
            <Cover accent={accent} />
        </svg>
    );
}

export default ProjectCover;
