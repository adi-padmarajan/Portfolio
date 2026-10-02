// A footer link; external ones open in a new tab and carry the same arrow as SocialLink
function FooterLink({ label, href, external = false }: { label: string; href: string; external?: boolean }){
    return(
        <li>
            <a
                href={href}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className="group inline-flex items-center gap-2 text-black/70 transition-colors hover:text-black"
            >
                {label}
                {external && (
                    <span
                        aria-hidden="true"
                        className="text-gray-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black"
                    >
                        ↗
                    </span>
                )}
            </a>
        </li>
    );
}

export default FooterLink;
