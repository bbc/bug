"use strict";

const axios = require("axios");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

const MAX_PORT_COUNT = 64;
const LABEL_CACHE_MS = 30000;
const SESSION_CACHE_MS = 600000;
let sessionCache = null;
let labelCache = null;

const getConfig = async () => {
    const config = await configGet();
    if (!config?.address) {
        throw new Error("Set the AJA KUMO router address in the panel configuration");
    }

    const port = Number(config.port || 80);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("The AJA KUMO HTTP port must be between 1 and 65535");
    }

    const address = config.address.trim();
    const parsedAddress = new URL(`http://${address}`);
    if (
        parsedAddress.username ||
        parsedAddress.password ||
        parsedAddress.pathname !== "/" ||
        parsedAddress.search ||
        parsedAddress.hash
    ) {
        throw new Error("Enter a hostname or IP address without a scheme or path");
    }

    return { config, baseUrl: `http://${parsedAddress.hostname}:${port}` };
};

const getSession = async ({ config, baseUrl }) => {
    if (!config.password) {
        return null;
    }

    if (
        sessionCache?.baseUrl === baseUrl &&
        sessionCache.password === config.password &&
        sessionCache.expiresAt > Date.now()
    ) {
        return sessionCache.cookie;
    }

    const response = await axios.post(
        `${baseUrl}/authenticator/login`,
        new URLSearchParams({ password_provided: config.password }),
        { timeout: 5000 }
    );

    if (response.data?.login !== "success") {
        throw new Error("AJA KUMO authentication failed; check the configured password");
    }

    const cookies = response.headers["set-cookie"];
    if (!cookies?.length) {
        throw new Error("AJA KUMO authentication succeeded but returned no session cookie");
    }

    const cookie = cookies.map((value) => value.split(";")[0]).join("; ");
    sessionCache = {
        baseUrl,
        password: config.password,
        cookie,
        expiresAt: Date.now() + SESSION_CACHE_MS,
    };
    return cookie;
};

const getParameter = async (device, cookie, paramid) => {
    const response = await axios.get(`${device.baseUrl}/config`, {
        params: { action: "get", configid: 0, paramid },
        headers: cookie ? { Cookie: cookie } : undefined,
        timeout: 5000,
    });
    const value = response.data?.value ?? response.data?.int_value ?? response.data?.str_value;
    if (value === undefined || value === null) {
        throw new Error(`AJA KUMO returned no value for ${paramid}`);
    }
    return value;
};

const getMatrixSize = async (device, cookie) => {
    const [sourceValue, destinationValue] = await Promise.all([
        getParameter(device, cookie, "eParamID_NumberOfSources"),
        getParameter(device, cookie, "eParamID_NumberOfDestinations"),
    ]);
    const sources = Number(sourceValue);
    const destinations = Number(destinationValue);

    if (
        !Number.isInteger(sources) ||
        sources < 1 ||
        sources > MAX_PORT_COUNT ||
        !Number.isInteger(destinations) ||
        destinations < 1 ||
        destinations > MAX_PORT_COUNT
    ) {
        throw new Error(
            `AJA KUMO reported unsupported matrix dimensions: ${sourceValue} inputs, ${destinationValue} outputs`
        );
    }

    return { sources, destinations };
};

const setParameter = async (device, cookie, paramid, value) => {
    const response = await axios.get(`${device.baseUrl}/config`, {
        params: { action: "set", configid: 0, paramid, value },
        headers: cookie ? { Cookie: cookie } : undefined,
        timeout: 5000,
    });

    if (response.data?.status === "error" || response.data?.result === "error") {
        throw new Error(`AJA KUMO rejected the update for ${paramid}`);
    }
};

const mapLimit = async (items, limit, callback) => {
    const results = new Array(items.length);
    let nextIndex = 0;
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (nextIndex < items.length) {
            const index = nextIndex++;
            results[index] = await callback(items[index], index);
        }
    });
    await Promise.all(workers);
    return results;
};

const getLabels = async (device, cookie, matrixSize) => {
    const key = `${device.baseUrl}:${matrixSize.sources}x${matrixSize.destinations}`;
    if (labelCache?.key === key && labelCache.expiresAt > Date.now()) {
        return labelCache.labels;
    }

    logger.debug("Refreshing AJA KUMO source and destination labels");
    const requests = [];
    for (let index = 1; index <= matrixSize.sources; index++) {
        requests.push({ type: "source", index });
    }
    for (let index = 1; index <= matrixSize.destinations; index++) {
        requests.push({ type: "destination", index });
    }

    const labels = await mapLimit(requests, 8, async ({ type, index }) => {
        const paramPrefix = type === "source" ? "Source" : "Destination";
        const [line1, line2] = await Promise.all([
            getParameter(device, cookie, `eParamID_XPT_${paramPrefix}${index}_Line_1`),
            getParameter(device, cookie, `eParamID_XPT_${paramPrefix}${index}_Line_2`),
        ]);
        const prefix = type === "source" ? "Source" : "Destination";
        return {
            type,
            index: index - 1,
            label:
                [line1, line2]
                    .map(String)
                    .map((value) => value.trim())
                    .filter(Boolean)
                    .join(" ") || `${prefix} ${index}`,
        };
    });

    const sourceLabels = [];
    const destinationLabels = [];
    for (const label of labels) {
        (label.type === "source" ? sourceLabels : destinationLabels)[label.index] = label.label;
    }

    const result = { sourceLabels, destinationLabels };
    labelCache = { key, labels: result, expiresAt: Date.now() + LABEL_CACHE_MS };
    return result;
};

const getRouter = async () => {
    const device = await getConfig();
    const cookie = await getSession(device);
    const matrixSize = await getMatrixSize(device, cookie);
    const { sourceLabels, destinationLabels } = await getLabels(device, cookie, matrixSize);
    const destinations = await mapLimit(
        Array.from({ length: matrixSize.destinations }, (_, index) => index),
        8,
        async (index) => {
            const input = Number(await getParameter(device, cookie, `eParamID_XPT_Destination${index + 1}_Status`));
            if (!Number.isInteger(input) || input < 1 || input > matrixSize.sources) {
                throw new Error(`AJA KUMO returned an invalid source for destination ${index + 1}`);
            }
            return {
                index,
                label: destinationLabels[index],
                inputIndex: input - 1,
                inputLabel: sourceLabels[input - 1],
            };
        }
    );

    return {
        matrixSize,
        sources: sourceLabels.map((label, index) => ({ index, label })),
        destinations,
    };
};

const route = async (destination, source) => {
    const destinationIndex = Number(destination);
    const sourceIndex = Number(source);
    if (
        !Number.isInteger(destinationIndex) ||
        destinationIndex < 0 ||
        !Number.isInteger(sourceIndex) ||
        sourceIndex < 0
    ) {
        throw new Error("Source and destination must be non-negative 0-based port indexes");
    }

    const device = await getConfig();
    const cookie = await getSession(device);
    const matrixSize = await getMatrixSize(device, cookie);
    if (destinationIndex >= matrixSize.destinations || sourceIndex >= matrixSize.sources) {
        throw new Error(
            `Port index out of range for this AJA KUMO (${matrixSize.sources} inputs, ${matrixSize.destinations} outputs)`
        );
    }

    await setParameter(device, cookie, `eParamID_XPT_Destination${destinationIndex + 1}_Status`, sourceIndex + 1);
    return true;
};

module.exports = { getRouter, route };
