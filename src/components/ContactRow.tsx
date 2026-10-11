import { useEffect, useState } from "react";

const RESET_DELAY_MS = 2000;

// Copies a value for visitors without a mail client set up, then confirms briefly
function CopyButton({ value, label }: { value: string; label: string }){
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), RESET_DELAY_MS);
        return () => clearTimeout(timeout);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
        } catch {
            // Clipboard can be blocked; the link itself still works
        }
    };

    return(
        <button
            type="button"
            onClick={handleCopy}
            className="relative z-10 shrink-0 rounded-full border border-current px-3 py-1.5 text-xs font-medium opacity-60 transition-opacity hover:opacity-100 sm:px-4 sm:text-sm"
        >
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
            <span className="sr-only"> {label}</span>
        </button>
    );
}

// One way to reach me, as a full-width ruled row. On hover or focus, white wipes up from the rule and the text
// inverts, so the whole row reads as one target. The value's link stretches over the row; Copy sits above it.
function ContactRow({
    label,
    value,
    href,
    copy,
}: {
    label: string;
    value: string;
    href: string;
    copy?: boolean;
}){
    const external = href.startsWith("http");

    return(
        <li data-row>
            <div data-rule className="h-px origin-left bg-white/15" />
            <div data-content className="group relative">
                <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:scale-y-100 group-hover:scale-y-100"
                />
                <div className="relative flex items-center gap-4 py-6 transition-[color,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:px-4 group-focus-within:text-black group-hover:px-4 group-hover:text-black sm:gap-6 sm:py-8 sm:group-hover:px-6 sm:group-focus-within:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-6">
                        <span className="flex items-center justify-between gap-4 sm:w-24 sm:shrink-0">
                            <span className="text-xs font-medium tracking-widest uppercase opacity-40">{label}</span>
                            {/* On phones, Copy moves up beside the label so the value keeps the full width */}
                            {copy && <span className="sm:hidden"><CopyButton value={value} label={label} /></span>}
                        </span>
                        <a
                            href={href}
                            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                            className="mt-1 block truncate text-lg font-medium tracking-tight after:absolute after:inset-0 focus-visible:outline-none sm:mt-0 sm:text-3xl"
                        >
                            {value}
                            {external && <span className="sr-only"> (opens in a new tab)</span>}
                        </a>
                    </div>

                    {copy && <span className="hidden sm:block"><CopyButton value={value} label={label} /></span>}

                    <span
                        aria-hidden="true"
                        className="shrink-0 text-xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 sm:text-2xl"
                    >
                        ↗
                    </span>
                </div>
            </div>
        </li>
    );
}

export default ContactRow;
