import { useEffect, useState } from "react";
import { cupsBy } from "../lib/cups";
import { vancouverMinutes } from "../lib/vancouverTime";

// The cups of coffee I've probably had so far today, going by the clock in Vancouver. Checks every minute while
// mounted.
function CupsToday(){
    const [cups, setCups] = useState(() => cupsBy(vancouverMinutes()));

    useEffect(() => {
        const interval = setInterval(() => setCups(cupsBy(vancouverMinutes())), 60_000);
        return () => clearInterval(interval);
    }, []);

    return <span data-count={cups}>{cups}</span>;
}

export default CupsToday;
