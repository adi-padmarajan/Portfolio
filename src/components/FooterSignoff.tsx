import { EMAIL } from "./contactDetails";

// A short closing line with the email underneath, so there's always a way to reach out at the bottom of the page
function FooterSignoff(){
    return(
        <div className="flex flex-col gap-4">
            <p className="text-xl leading-snug tracking-tight text-gray-400 sm:text-2xl">
                <span className="text-black">Open to new roles and collaborations.</span>{" "}
                Let's build something useful.
            </p>
            <a
                href={`mailto:${EMAIL}`}
                className="w-fit break-all text-sm font-medium text-black underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-black sm:text-base"
            >
                {EMAIL}
            </a>
        </div>
    );
}

export default FooterSignoff;
