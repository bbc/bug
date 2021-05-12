import { useRef, useState } from "react";
import useAsyncEffect from "use-async-effect";
import axios from "axios";

export function useApiPoller({ url, interval }) {
    const timer = useRef();
    const [pollResult, setPollResult] = useState({
        status: "idle",
        data: null,
        error: null,
    });
    const localResult = useRef(pollResult);
    const cancelToken = useRef(axios.CancelToken.source());

    useAsyncEffect(
        async () => {
            const triggerUpdate = (newState) => {
                // this method checks if the data has changed
                if (JSON.stringify(localResult.current) !== JSON.stringify(newState)) {
                    // it has - store the local value
                    localResult.current = newState;

                    // and update the state (to trigger a render in the parent component)
                    setPollResult(newState);
                }
            };

            const fetch = async () => {
                // clear any pending refresh
                clearTimeout(timer.current);

                try {
                    // fetch the data from the API
                    const response = await axios.get(url, {
                        cancelToken: cancelToken.current.token,
                    });

                    // if we get an error from the API, throw it as an exception
                    if (response.data.status === "error") {
                        throw response.data.message;
                    }

                    triggerUpdate({
                        status: "success",
                        data: response.data.data,
                        error: null,
                    });

                    // now we're done, set a timeout for the next poll
                    timer.current = setTimeout(fetch, interval);
                } catch (error) {
                    // if we've cancelled the axios request (by unloading this component) just quit - no problem!
                    if (axios.isCancel(error)) {
                        return;
                    }

                    // send an update with the failed state
                    setPollResult({
                        status: "failed",
                        data: null,
                        error: null,
                    });

                    // log the error for good measure
                    console.error(error);

                    // and start it all again!
                    timer.current = setTimeout(fetch, interval);
                }
            };
            fetch();
        },
        () => {
            // this is run when the component is unloaded
            // first of all - clear any pending requests
            clearTimeout(timer.current);

            // cancel any in-flight axios requests
            cancelToken.current.cancel();
        },
        [url, interval]
    );
    return pollResult;
}
