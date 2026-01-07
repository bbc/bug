import { useRecursiveTimeout } from "@hooks/RecursiveTimeout";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export function useApiPoller({
    polling = true,
    url,
    mockApiData = null,
    interval,
    forceRefresh,
    errorInterval = null,
    postData = null,
}) {
    const [pollResult, setPollResult] = useState({
        status: "idle",
        data: null,
        error: null,
    });

    const localResult = useRef(pollResult);
    const controllerRef = useRef(null); // single controller per endpoint

    if (!errorInterval) errorInterval = interval;

    const triggerUpdate = (newState) => {
        if (JSON.stringify(localResult.current) !== JSON.stringify(newState)) {
            localResult.current = newState;
            setPollResult(newState);
        }
    };

    const fetchData = async () => {
        if (!url) return;

        // cancel any previous request before starting a new one
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const axiosConfig = { signal: controller.signal };
            const response = postData
                ? await axios.post(url, postData, axiosConfig)
                : await axios.get(url, axiosConfig);

            if (response.data?.status === "error") {
                throw new Error(response.data.message || "API Error");
            }

            triggerUpdate({
                status: "success",
                data: response.data.data,
                error: null,
            });
        } catch (error) {
            if (error.name === "CanceledError") return;

            triggerUpdate({
                status: "failure",
                data: pollResult.data,
                error: error.message || null,
            });

            console.error(error);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (mockApiData || !url) return;

        fetchData();

        return () => {
            // cancel any ongoing request on unmount
            controllerRef.current?.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, forceRefresh]);

    // Polling
    useRecursiveTimeout(() => {
        if (!url || !polling || mockApiData) return;
        fetchData();
    }, interval);

    if (mockApiData) return mockApiData;

    return pollResult;
}
