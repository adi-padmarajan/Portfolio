// Single source for the Experience section and its detail popup, newest role first.
// Words wrapped in **double asterisks** are set in black against the grey of the rest of the line.
export type Experience = {
    company: string;
    role: string;
    period: string;
    location: string;
    summary: string;
    highlights: string[];
    stack: string[];
};

export const EXPERIENCES: Experience[] = [
    {
        company: "STEMCELL Technologies",
        role: "Software Developer Co-op, R&D Custom Products",
        period: "Sep 2026 — Present",
        location: "Vancouver, BC",
        summary:
            "Building the platform behind custom research products, from manufacturing feasibility through pricing, quoting and ERP.",
        highlights: [
            "Developing a full-stack custom products platform using **React, TypeScript, AWS Amplify Gen 2, Lambda and PostgreSQL**, supporting manufacturing feasibility, pricing, quoting and ERP workflows.",
            "Co-engineering **freight and temperature logger pricing logic** across React and AWS Lambda, collaborating with R&D, Pricing and Sales to resolve quote calculation discrepancies.",
            "Designing a **regression test matrix** covering every order-status permutation to catch defects in automated shipping and inventory-transfer notifications, reducing reliance on manual follow-ups.",
            "Selected as the **first Software Developer Co-op hired since COVID-19**, joining the Software Development Engineering team to support internal R&D applications.",
        ],
        stack: ["React", "TypeScript", "AWS Amplify Gen 2", "AWS Lambda", "PostgreSQL"],
    },
    {
        company: "The Salvation Army",
        role: "Product Engineer",
        period: "Oct 2026 — Present",
        location: "Vancouver, BC",
        summary:
            "Building CareRide, a transportation platform that gets vulnerable clients to essential services without needing a phone or payment.",
        highlights: [
            "Building **CareRide**, a nonprofit transportation platform built with The Salvation Army, connecting social service staff with volunteer drivers so vulnerable clients can reach essential services.",
            "Architected the workflows for **ride booking, driver matching and staff dashboards**, supporting accessibility-based matching, real-time trip tracking and administrative approvals in **React and TypeScript**.",
            "Shipped a working **web and Android MVP in 48 hours** with a team of **3 engineers** at HACKVAN 2026, using **Cloudflare Workers and Capacitor** across **40+ pull requests**.",
            "Driving the production roadmap with Salvation Army stakeholders, prioritizing secure authentication, driver verification, booking notifications and recurring rides.",
        ],
        stack: ["React", "TypeScript", "Cloudflare Workers", "Capacitor", "Supabase"],
    },
    {
        company: "RBC Borealis",
        role: "AI/ML Research Mentee",
        period: "Mar 2026 — May 2026",
        location: "Remote",
        summary:
            "Researched why people disengage from a health program, turning years of longitudinal records into cohorts and a dashboard teams could act on.",
        highlights: [
            "Analyzed **1,500+ longitudinal health records** spanning 3+ years alongside **2 senior AI researchers**, identifying disengagement patterns across 20+ behavioural features using **Python, Pandas and NumPy**.",
            "Applied **UMAP dimensionality reduction** to high-dimensional engagement data, identifying **4+ distinct user cohorts** to inform downstream ML model development.",
            "Developed an **analytics dashboard for 4+ clinical and program teams**, visualizing retention trends, engagement patterns and disengagement risk using **Python, Matplotlib and GA4**.",
        ],
        stack: ["Python", "Pandas", "NumPy", "UMAP", "Matplotlib", "GA4"],
    },
];
