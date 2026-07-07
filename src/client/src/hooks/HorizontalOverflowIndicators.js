import { useCallback, useEffect, useRef, useState } from "react";

export function useHorizontalOverflowIndicators() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const element = scrollRef.current;

        if (!element) {
            setCanScrollLeft(false);
            setCanScrollRight(false);
            return;
        }

        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        const threshold = 1;
        setCanScrollLeft(element.scrollLeft > threshold);
        setCanScrollRight(maxScrollLeft - element.scrollLeft > threshold);
    }, []);

    useEffect(() => {
        updateScrollState();

        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const element = scrollRef.current;
        if (!element) {
            return;
        }

        const observer = new ResizeObserver(() => {
            updateScrollState();
        });

        observer.observe(element);

        if (element.firstElementChild) {
            observer.observe(element.firstElementChild);
        }

        return () => {
            observer.disconnect();
        };
    }, [updateScrollState]);

    return {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        updateScrollState,
    };
}
