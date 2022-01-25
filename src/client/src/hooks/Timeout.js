import { useEffect, useLayoutEffect, useRef } from "react";

function useTimeout(callback, delay = null) {
    const savedCallback = useRef(callback);

    // Remember the latest callback if it changes.
    useLayoutEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the timeout.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        // Note: 0 is a valid value for delay.
        if (!delay && delay !== 0) {
            return;
        }

        const id = setTimeout(() => savedCallback.current(), delay);

        return () => clearTimeout(id);
    }, [delay]);
}

export { useTimeout };
