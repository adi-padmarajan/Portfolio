import { useEffect, useState } from "react";
import { EMAIL } from "./contactDetails";
import { PILL_CLASSES } from "./PillLink";

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
        <button type="button" onClick={handleCopy} className={PILL_CLASSES}>
            <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
        </button>
    );
}

export default CopyEmailButton;
