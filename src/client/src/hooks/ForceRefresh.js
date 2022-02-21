import React from "react";

export function useForceRefresh() {
    const [counter, setCounter] = React.useState(0);

    const doForceRefresh = () => {
        setCounter(counter + 1);
    };

    return [counter, doForceRefresh];
}
