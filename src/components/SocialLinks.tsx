import { SOCIAL_LINKS } from "./contactDetails";
import SocialLink from "./SocialLink";

// Labelled to match the About section's InfoBlocks
function SocialLinks(){
    return(
        <div data-animate>
            <h3 className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                Elsewhere
            </h3>
            <ul className="mt-3 space-y-1 sm:mt-4">
                {SOCIAL_LINKS.map((link) => (
                    <li key={link.href}>
                        <SocialLink label={link.label} href={link.href} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SocialLinks;
