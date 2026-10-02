import { EMAIL } from "./contactDetails";
import CopyEmailButton from "./CopyEmailButton";

// The address itself, large enough to read at a glance, with a quick way to copy it
function EmailLink(){
    return(
        <div data-animate className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
                href={`mailto:${EMAIL}`}
                className="break-all text-lg font-medium text-black underline decoration-gray-300 underline-offset-8 transition-colors hover:decoration-black sm:text-2xl"
            >
                {EMAIL}
            </a>
            <CopyEmailButton />
        </div>
    );
}

export default EmailLink;
