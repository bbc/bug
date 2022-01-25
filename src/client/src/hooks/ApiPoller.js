import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useRecursiveTimeout } from "@hooks/RecursiveTimeout";

export function useApiPoller({ url, interval, forceRefresh, errorInterval = null, postData = null }) {
    const [pollResult, setPollResult] = useState({
        status: "idle",
        data: null,
        error: null,
    });

    const localResult = useRef(pollResult);
    if (!errorInterval) {
        errorInterval = interval;
    }

    // useEffect(() => {
    const source = axios.CancelToken.source();
    const cancelToken = source.token;

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
        try {
            // fetch the data from the API
            let response = null;
            if (postData) {
                response = await axios.post(url, postData, {
                    cancelToken: cancelToken,
                });
            } else {
                response = await axios.get(url, {
                    cancelToken: cancelToken,
                });
            }
            // if we get an error from the API, throw it as an exception
            if (response.data.status === "error") {
                throw response.data.message;
            }

            triggerUpdate({
                status: "success",
                data: response.data.data,
                error: null,
            });
        } catch (error) {
            // if we've cancelled the axios request (by unloading this component) just quit - no problem!
            if (axios.isCancel(error)) {
                return;
            }

            // send an update with the failed state
            triggerUpdate({
                status: "failure",
                data: null,
                error: null,
            });

            // log the error for good measure
            console.error(error);
        }
    };

    useEffect(() => {
        fetch();

        return () => {
            // this is run when the component is unloaded
            // cancel any in-flight axios requests
            source.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, interval, forceRefresh, errorInterval, postData]);

    useRecursiveTimeout(async () => {
        await fetch();
    }, interval);

    return pollResult;
}
