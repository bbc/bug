import { useEffect, useState } from "react";

function useElapsedTime(startTime, interval = 1000) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!startTime) return;

        const id = setInterval(() => {
            setNow(Date.now());
        }, interval);

        return () => clearInterval(id);
    }, [startTime, interval]);

    return Math.max(0, now - new Date(startTime).getTime());
}

export { useElapsedTime };
