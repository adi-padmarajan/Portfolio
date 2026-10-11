import { useEffect, useState } from "react";
import { CUPS, cupsBy } from "../lib/cups";
import { vancouverMinutes } from "../lib/vancouverTime";

// The cups of coffee I've probably had so far today, going by the clock in Vancouver, with a word on where
// the day stands at either end. Checks every minute while mounted.
function CupsToday(){
    const [cups, setCups] = useState(() => cupsBy(vancouverMinutes()));

    useEffect(() => {
        const interval = setInterval(() => setCups(cupsBy(vancouverMinutes())), 60_000);
        return () => clearInterval(interval);
    }, []);

    const note = cups === 0 ? "first one’s brewing" : cups === CUPS.length ? "that’s the lot" : null;

    return(
        <>
            <span data-count={cups}>{cups}</span>
            {note && <span className="ml-2 text-sm text-[#8c7a6b] sm:text-base">· {note}</span>}
        </>
    );
}

export default CupsToday;
