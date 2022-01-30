import { useEffect, useRef } from "react";

export function useRecursiveTimeout(callback, delay = null) {
    const savedCallback = useRef(callback);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the timeout loop.
    useEffect(() => {
        let id;
        function tick() {
            const ret = savedCallback.current();

            if (ret instanceof Promise) {
                ret.then(() => {
                    if (delay !== null) {
                        id = setTimeout(tick, delay);
                    }
                });
            } else {
                if (delay !== null) {
                    id = setTimeout(tick, delay);
                }
            }
        }
        if (delay !== null) {
            id = setTimeout(tick, delay);
            return () => id && clearTimeout(id);
        }
    }, [delay]);
}
