// An external profile link with an arrow that nudges up-right on hover
function SocialLink({ label, href }: { label: string; href: string }){
    return(
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
        >
            {label}
            <span
                aria-hidden="true"
                className="text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
            >
                ↗
            </span>
        </a>
    );
}

export default SocialLink;
