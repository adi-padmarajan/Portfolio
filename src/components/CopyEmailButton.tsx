import { useEffect, useState } from "react";
import { EMAIL } from "./contactDetails";

const RESET_DELAY_MS = 2000;

// Copies the address for visitors without a mail client set up, then confirms briefly
function CopyEmailButton(){
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), RESET_DELAY_MS);
        return () => clearTimeout(timeout);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
        } catch {
            // Clipboard can be blocked; the mailto link is still there
        }
    };

    return(
        <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-medium tracking-widest text-gray-400 uppercase transition-colors hover:text-black"
        >
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
    );
}

export default CopyEmailButton;
