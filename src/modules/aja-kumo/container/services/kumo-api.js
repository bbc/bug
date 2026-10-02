"use strict";

const axios = require("axios");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

const MAX_PORT_COUNT = 64;
const LABEL_CACHE_MS = 30000;
const SESSION_CACHE_MS = 600000;
let sessionCache = null;
let labelCache = null;

const getConfig = async (configOverride) => {
    const config = configOverride || (await configGet());
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

const getLabels = async (device, cookie, matrixSize, forceRefresh = false) => {
    const key = `${device.baseUrl}:${matrixSize.sources}x${matrixSize.destinations}`;
    if (!forceRefresh && labelCache?.key === key && labelCache.expiresAt > Date.now()) {
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
        const portLabelLines = [line1, line2].map((value) => String(value).trim());
        const label = portLabelLines.filter(Boolean).join(" ") || `${prefix} ${index}`;
        return {
            type,
            index: index - 1,
            label,
            line1: portLabelLines[0],
            line2: portLabelLines[1],
        };
    });

    const sourcePorts = [];
    const destinationPorts = [];
    for (const label of labels) {
        const ports = label.type === "source" ? sourcePorts : destinationPorts;
        ports[label.index] = { label: label.label, line1: label.line1, line2: label.line2 };
    }

    const result = {
        sourcePorts,
        destinationPorts,
        sourceLabels: sourcePorts.map((port) => port.label),
        destinationLabels: destinationPorts.map((port) => port.label),
    };
    labelCache = { key, labels: result, expiresAt: Date.now() + LABEL_CACHE_MS };
    return result;
};

const getRouter = async (configOverride, { refreshLabels = false } = {}) => {
    const device = await getConfig(configOverride);
    const cookie = await getSession(device);
    const matrixSize = await getMatrixSize(device, cookie);
    const { sourceLabels, sourcePorts, destinationPorts } = await getLabels(device, cookie, matrixSize, refreshLabels);
    const destinations = await mapLimit(
        Array.from({ length: matrixSize.destinations }, (_, index) => index),
        8,
        async (index) => {
            const input = Number(await getParameter(device, cookie, `eParamID_XPT_Destination${index + 1}_Status`));
            const isLocked =
                Number(await getParameter(device, cookie, `eParamID_XPT_Destination${index + 1}_Locked`)) === 1;
            if (!Number.isInteger(input) || input < 1 || input > matrixSize.sources) {
                throw new Error(`AJA KUMO returned an invalid source for destination ${index + 1}`);
            }
            return {
                ...destinationPorts[index],
                index,
                inputIndex: input - 1,
                inputLabel: sourceLabels[input - 1],
                isLocked,
            };
        }
    );

    return {
        matrixSize,
        sources: sourcePorts.map((port, index) => ({ index, ...port })),
        destinations,
    };
};

const route = async (destination, source, matrixSize) => {
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

    if (!matrixSize || destinationIndex >= matrixSize.destinations || sourceIndex >= matrixSize.sources) {
        throw new Error(
            matrixSize
                ? `Port index out of range for this AJA KUMO (${matrixSize.sources} inputs, ${matrixSize.destinations} outputs)`
                : "AJA KUMO has not reported its matrix dimensions yet"
        );
    }

    const device = await getConfig();
    const cookie = await getSession(device);
    await setParameter(device, cookie, `eParamID_XPT_Destination${destinationIndex + 1}_Status`, sourceIndex + 1);
    return true;
};

const setLabel = async (type, index, line1, line2, matrixSize) => {
    if (!["source", "destination"].includes(type)) {
        throw new Error("Label type must be source or destination");
    }

    const portIndex = Number(index);
    if (!Number.isInteger(portIndex) || portIndex < 0) {
        throw new Error("Label index must be a non-negative 0-based port index");
    }
    if (typeof line1 !== "string" || typeof line2 !== "string") {
        throw new Error("Both KUMO label lines must be strings");
    }

    const portCount = type === "source" ? matrixSize?.sources : matrixSize?.destinations;
    if (!portCount) {
        throw new Error("AJA KUMO has not reported its matrix dimensions yet");
    }
    if (portIndex >= portCount) {
        throw new Error(`Label index out of range for this AJA KUMO (${portCount} ${type} ports)`);
    }

    const device = await getConfig();
    const cookie = await getSession(device);
    const paramPrefix = type === "source" ? "Source" : "Destination";
    await setParameter(device, cookie, `eParamID_XPT_${paramPrefix}${portIndex + 1}_Line_1`, line1);
    await setParameter(device, cookie, `eParamID_XPT_${paramPrefix}${portIndex + 1}_Line_2`, line2);
    labelCache = null;
    return true;
};

const setDestinationLock = async (index, locked, matrixSize) => {
    const destinationIndex = Number(index);
    if (
        !Number.isInteger(destinationIndex) ||
        destinationIndex < 0 ||
        !matrixSize ||
        destinationIndex >= matrixSize.destinations
    ) {
        throw new Error("Destination index is out of range for this AJA KUMO");
    }
    if (typeof locked !== "boolean") {
        throw new Error("Destination lock state must be a boolean");
    }

    const device = await getConfig();
    const cookie = await getSession(device);
    const paramid = `eParamID_XPT_Destination${destinationIndex + 1}_Locked`;
    await setParameter(device, cookie, paramid, locked ? 1 : 0);
    const actualLock = Number(await getParameter(device, cookie, paramid)) === 1;
    if (actualLock !== locked) {
        throw new Error(`Failed to verify AJA KUMO lock state for destination ${destinationIndex + 1}`);
    }
    return true;
};

module.exports = { getRouter, route, setLabel, setDestinationLock };
