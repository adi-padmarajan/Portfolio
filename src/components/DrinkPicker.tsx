import { useRef } from "react";
import type { KeyboardEvent, Ref } from "react";
import DrinkIcon from "./DrinkIcon";
import { DRINKS } from "../lib/coffeeOrder";
import type { DrinkId } from "../lib/coffeeOrder";

const SIZES = {
    // Three over two on phones, all five in a row from sm up
    // (and, on phones turned sideways, a smaller row that leaves room for the greeting above it)
    intro: { layout: "flex flex-wrap justify-center max-w-[16rem] gap-x-4 gap-y-6 sm:max-w-none sm:gap-x-8 short:gap-x-6", item: "min-w-16", icon: "w-16 sm:w-20 short:w-12", label: "text-xs sm:text-sm short:text-xs" },
    // All five in one row, even inside a narrow phone's menu
    compact: { layout: "grid grid-cols-5 gap-x-1", item: "min-w-0", icon: "w-10", label: "text-[0.625rem]" },
};

type DrinkPickerProps = {
    // The drink currently ordered, shown as pressed
    value: DrinkId;
    onChoose: (drink: DrinkId) => void;
    size?: keyof typeof SIZES;
    label: string;
    listRef?: Ref<HTMLDivElement>;
};

// The menu of drinks as a row of cups to press. Tab reaches the row once; the arrow keys move between drinks and
// Enter or Space orders one. Each cup lifts a touch, with a wisp of steam, while it's hovered or focused.
function DrinkPicker({ value, onChoose, size = "intro", label, listRef }: DrinkPickerProps){
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);
    const sizing = SIZES[size];

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        let next: number | undefined;
        const at = buttons.current.findIndex((button) => button === document.activeElement);
        if (e.key in keys) next = (at + keys[e.key] + DRINKS.length) % DRINKS.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = DRINKS.length - 1;
        if (next === undefined) return;
        e.preventDefault();
        buttons.current[next]?.focus();
    };

    return(
        <div
            ref={listRef}
            role="group"
            aria-label={label}
            onKeyDown={onKeyDown}
            className={sizing.layout}
        >
            {DRINKS.map((drink, i) => {
                const chosen = drink.id === value;
                return(
                    <button
                        key={drink.id}
                        ref={(el) => { buttons.current[i] = el; }}
                        type="button"
                        data-drink={drink.id}
                        aria-pressed={chosen}
                        tabIndex={chosen ? 0 : -1}
                        onClick={() => {
                            // A tiny buzz to confirm the order, where the phone supports it (Android; iOS ignores it)
                            if (window.matchMedia("(pointer: coarse)").matches) navigator.vibrate?.(10);
                            onChoose(drink.id);
                        }}
                        className={`group flex ${sizing.item} cursor-pointer flex-col items-center gap-2 rounded-2xl px-1 py-2 touch-manipulation [-webkit-tap-highlight-color:transparent]`}
                    >
                        <span className="relative block">
                            {/* A wisp of steam that rises off the cup on hover or focus */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-3 left-1/2 h-5 w-px -translate-x-1/2 rounded-full bg-gray-300 opacity-0 blur-[1.5px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:group-hover:animate-steam motion-safe:group-focus-visible:animate-steam"
                            />
                            <DrinkIcon
                                drink={drink.id}
                                className={`${sizing.icon} transition-transform duration-300 ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1`}
                            />
                        </span>
                        <span className={`${sizing.label} font-medium ${chosen && size === "compact" ? "text-black" : "text-gray-600"}`}>
                            {drink.name}
                        </span>
                        {"note" in drink && size === "intro" && (
                            <span className="-mt-1.5 text-[0.625rem] tracking-widest text-gray-400 uppercase">{drink.note}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default DrinkPicker;
