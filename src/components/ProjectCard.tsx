import ProjectCover from "./ProjectCover";
import type { Project } from "./projects";

// One project: a drawn cover, then the story in the About section's black-over-grey type.
// The title's link stretches over the whole card, so the card opens its primary link; the other links sit above
// that layer and stay separately clickable, without nesting one link inside another.
function ProjectCard({ project, number }: { project: Project; number: string }){
    const [primary, ...secondary] = project.links;

    return(
        <article className="group relative">
            <div
                data-cover
                className="relative aspect-4/3 overflow-hidden rounded-3xl bg-neutral-950"
            >
                <ProjectCover kind={project.cover} accent={project.accent} />

                {project.award && (
                    <p className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:top-5 sm:left-5">
                        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" style={{ color: project.accent }}>
                            <path d="M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8 3.8 14l.8-4.7L1.2 6l4.7-.7z" fill="currentColor" />
                        </svg>
                        {project.award}
                    </p>
                )}

                {/* Grows in on hover to say where the card leads */}
                <span
                    aria-hidden="true"
                    className="absolute right-4 bottom-4 flex h-14 w-14 scale-0 items-center justify-center rounded-full bg-white text-xl text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:scale-100 group-hover:scale-100 sm:right-5 sm:bottom-5 sm:h-16 sm:w-16"
                >
                    ↗
                </span>
            </div>

            <div data-body className="mt-6 sm:mt-8">
                <p className="text-xs text-gray-400 tabular-nums">
                    {number}
                    <span aria-hidden="true" className="mx-2">·</span>
                    {project.context}
                    <span aria-hidden="true" className="mx-2">·</span>
                    {project.year}
                </p>

                <h3 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
                    <a
                        href={primary.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-8 focus-visible:after:outline-black"
                    >
                        {project.title}
                        <span className="sr-only"> ({primary.label}, opens in a new tab)</span>
                    </a>
                </h3>

                <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">{project.tagline}</p>

                <ul className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((tool) => (
                        <li key={tool} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 sm:text-sm">
                            {tool}
                        </li>
                    ))}
                </ul>

                {/* Lifted above the stretched link so each one is its own target */}
                <ul className="relative z-10 mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    {[primary, ...secondary].map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex items-center gap-1.5 text-black underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-black"
                            >
                                {link.label}
                                <span
                                    aria-hidden="true"
                                    className="text-gray-400 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-black"
                                >
                                    ↗
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
}

export default ProjectCard;
