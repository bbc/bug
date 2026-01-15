import { useRecursiveTimeout } from "@hooks/RecursiveTimeout";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

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

    // use a ref to track result so async calls always see the latest state
    const localResult = useRef(pollResult);
    const controllerRef = useRef(null);

    const actualErrorInterval = errorInterval || interval;

    // trigger update only if data or status has actually changed
    const triggerUpdate = useCallback((newState) => {
        const hasChanged =
            localResult.current.status !== newState.status ||
            localResult.current.error !== newState.error ||
            JSON.stringify(localResult.current.data) !== JSON.stringify(newState.data);

        if (hasChanged) {
            localResult.current = newState;
            setPollResult(newState);
        }
    }, []);

    const fetchData = useCallback(async () => {
        if (!url || mockApiData) return;

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
                throw new Error(response.data.message || "api error");
            }

            triggerUpdate({
                status: "success",
                data: response.data.data,
                error: null,
            });
        } catch (error) {
            // ignore cleanup-driven cancellations
            if (axios.isCancel(error) || error.name === "CanceledError") return;

            triggerUpdate({
                status: "failure",
                data: localResult.current.data, // use ref value to avoid closure staleness
                error: error.message || "unknown error",
            });

            console.error(error);
        }
    }, [url, postData, mockApiData, triggerUpdate]);

    // trigger fetch on url, postdata, or manual refresh changes
    useEffect(() => {
        if (mockApiData || !url) return;

        fetchData();

        return () => {
            controllerRef.current?.abort();
        };
    }, [url, forceRefresh, postData, mockApiData, fetchData]);

    // handle polling loop
    useRecursiveTimeout(() => {
        if (!url || !polling || mockApiData) return;
        fetchData();
    }, pollResult.status === "failure" ? actualErrorInterval : interval);

    // handle mock data return
    if (mockApiData) return mockApiData;

    return pollResult;
}