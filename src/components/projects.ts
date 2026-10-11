// Single source for the Featured Projects section, newest first. Adding a project is one entry here; `cover`
// picks its illustration in ProjectCover, and `accent` tints it.
export type ProjectCoverKind = "route" | "sense" | "radar" | "clusters";

export type ProjectLink = {
    label: string;
    href: string;
};

export type Project = {
    title: string;
    tagline: string;
    // Where and when it was built, e.g. the hackathon or program
    context: string;
    year: string;
    award?: string;
    stack: string[];
    // The first link is the primary one: the whole card opens it
    links: ProjectLink[];
    cover: ProjectCoverKind;
    accent: string;
};

export const PROJECTS: Project[] = [
    {
        title: "CareRide",
        tagline:
            "Free rides to essential services for people without a phone, an app or a way to pay. Staff book the trip; verified volunteer drivers take it.",
        context: "HACKVAN · The Salvation Army",
        year: "2026",
        stack: ["React", "TypeScript", "Supabase", "Cloudflare Workers", "Capacitor"],
        links: [
            { label: "GitHub", href: "https://github.com/adi-padmarajan/CareRide" },
            { label: "Live app", href: "https://careride-team-1.careride.workers.dev/" },
        ],
        cover: "route",
        accent: "#5b8cff",
    },
    {
        title: "SpideyIRL",
        tagline:
            "A real-life Spidey Sense: a headband that turns nearby obstacles into directional vibration, and answers out loud when you ask what the camera sees.",
        context: "Hack the North",
        year: "2026",
        award: "3rd Place · QNX Embedded + AI",
        stack: ["C", "QNX", "Python", "YOLO", "Vosk", "Raspberry Pi"],
        links: [{ label: "GitHub", href: "https://github.com/adi-padmarajan/SpideyIRL" }],
        cover: "sense",
        accent: "#ef4444",
    },
    {
        title: "Pulse",
        tagline:
            "A live quest radar for Web Summit that shows who nearby is worth talking to right now, with Claude-written openers to start the conversation.",
        context: "Web Summit Vancouver",
        year: "2026",
        award: "1st Place · Web Summit Hackathon",
        stack: ["React", "TypeScript", "TanStack Start", "Supabase", "Claude"],
        links: [
            { label: "GitHub", href: "https://github.com/adi-padmarajan/pulse-websummit-hackathon-2026" },
            { label: "Devpost", href: "https://devpost.com/software/pulse-real-time-networking-radar" },
            { label: "Demo video", href: "https://youtu.be/K-wmFjelY1g" },
        ],
        cover: "radar",
        accent: "#facc15",
    },
    {
        title: "Upopolis Analytics",
        tagline:
            "Bot-aware engagement analytics for a youth health platform, turning 1,000+ days of GA4 data into cohorts and a dashboard for stakeholders.",
        context: "RBC Borealis · Let’s SOLVE It",
        year: "2026",
        stack: ["Python", "Pandas", "UMAP", "Streamlit", "GA4"],
        links: [
            { label: "GitHub", href: "https://github.com/adi-padmarajan/Upoplis-RBC-Borealis-LSI" },
            { label: "Dashboard", href: "https://lsi26-uvic-khlf.streamlit.app/" },
        ],
        cover: "clusters",
        accent: "#2dd4bf",
    },
];
