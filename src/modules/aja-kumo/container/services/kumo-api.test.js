"use strict";

jest.mock("axios", () => ({
    get: jest.fn(),
    post: jest.fn(),
}));
jest.mock("@core/config-get", () => jest.fn());
jest.mock("@core/logger", () => () => ({ debug: jest.fn() }));

const makeGetResponse = (value) => ({ data: { value } });

const setup = (config = { address: "192.0.2.10", port: "8080" }, options = {}) => {
    jest.resetModules();
    const axios = require("axios");
    const configGet = require("@core/config-get");
    configGet.mockResolvedValue(config);

    const dimensions = options.dimensions || { sources: 32, destinations: 4 };
    axios.get.mockImplementation(async (url, request) => {
        const { action, paramid } = request.params;
        if (action === "set") {
            return { data: { status: "success" } };
        }
        if (paramid === "eParamID_NumberOfSources") {
            return makeGetResponse(dimensions.sources);
        }
        if (paramid === "eParamID_NumberOfDestinations") {
            return makeGetResponse(dimensions.destinations);
        }

        const source = paramid.match(/^eParamID_XPT_Source(\d+)_Line_(\d+)$/);
        if (source) {
            const label = Number(source[1]) === 1 ? "Camera One" : `Input ${source[1]}`;
            return makeGetResponse(Number(source[2]) === 1 ? label : "Line Two");
        }

        const destination = paramid.match(/^eParamID_XPT_Destination(\d+)_Line_(\d+)$/);
        if (destination) {
            return makeGetResponse(Number(destination[2]) === 1 ? `Output ${destination[1]}` : "Label");
        }

        const route = paramid.match(/^eParamID_XPT_Destination(\d+)_Status$/);
        if (route) {
            return makeGetResponse(options.routeSource || 2);
        }
        if (/^eParamID_XPT_Destination\d+_Locked$/.test(paramid)) {
            return makeGetResponse(0);
        }

        throw new Error(`Unexpected KUMO parameter ${paramid} at ${url}`);
    });

    return { axios, configGet, api: require("./kumo-api") };
};

describe("kumo-api", () => {
    test("discovers asymmetric dimensions, fetches custom labels and current routes", async () => {
        const { axios, api } = setup();

        const router = await api.getRouter();

        expect(router.matrixSize).toEqual({ sources: 32, destinations: 4 });
        expect(router.sources).toHaveLength(32);
        expect(router.destinations).toHaveLength(4);
        expect(router.sources[0]).toEqual({
            index: 0,
            label: "Camera One Line Two",
            line1: "Camera One",
            line2: "Line Two",
        });
        expect(router.sources[31]).toEqual({
            index: 31,
            label: "Input 32 Line Two",
            line1: "Input 32",
            line2: "Line Two",
        });
        expect(router.destinations[0]).toEqual({
            index: 0,
            label: "Output 1 Label",
            line1: "Output 1",
            line2: "Label",
            inputIndex: 1,
            inputLabel: "Input 2 Line Two",
            isLocked: false,
        });
        expect(axios.get).toHaveBeenCalledWith(
            "http://192.0.2.10:8080/config",
            expect.objectContaining({
                params: { action: "get", configid: 0, paramid: "eParamID_NumberOfSources" },
            })
        );
    });

    test("supports authenticated requests and reuses the session", async () => {
        const { axios, api } = setup({ address: "kumo.local", port: 80, password: "secret" });
        axios.post.mockResolvedValue({
            data: { login: "success" },
            headers: { "set-cookie": ["session=abc; Path=/; HttpOnly"] },
        });

        await api.getRouter();
        await api.getRouter();

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(
            "http://kumo.local:80/authenticator/login",
            expect.any(URLSearchParams),
            expect.objectContaining({ timeout: 5000 })
        );
        expect(axios.get).toHaveBeenCalledWith(
            "http://kumo.local:80/config",
            expect.objectContaining({ headers: { Cookie: "session=abc" } })
        );
    });

    test("rejects invalid reported dimensions", async () => {
        const { api } = setup(undefined, { dimensions: { sources: 128, destinations: 16 } });

        await expect(api.getRouter()).rejects.toThrow("unsupported matrix dimensions");
    });

    test("rejects a device route that refers to a nonexistent source", async () => {
        const { api } = setup(undefined, { dimensions: { sources: 16, destinations: 4 }, routeSource: 17 });

        await expect(api.getRouter()).rejects.toThrow("invalid source for destination 1");
    });

    test("routes using 1-based device port IDs after validating dynamic dimensions", async () => {
        const { axios, api } = setup();

        await expect(api.route(3, 31, { sources: 32, destinations: 4 })).resolves.toBe(true);

        expect(axios.get).toHaveBeenCalledWith(
            "http://192.0.2.10:8080/config",
            expect.objectContaining({
                params: {
                    action: "set",
                    configid: 0,
                    paramid: "eParamID_XPT_Destination4_Status",
                    value: 32,
                },
            })
        );
        await expect(api.route(4, 0, { sources: 32, destinations: 4 })).rejects.toThrow("Port index out of range");
    });

    test("sets and verifies a hardware lock on a destination", async () => {
        const { axios, api } = setup();
        axios.get.mockImplementation(async (url, request) => {
            if (request.params.action === "set") {
                return { data: { status: "success" } };
            }
            return makeGetResponse(1);
        });

        await expect(api.setDestinationLock(1, true, { destinations: 4 })).resolves.toBe(true);
        expect(axios.get).toHaveBeenNthCalledWith(
            1,
            "http://192.0.2.10:8080/config",
            expect.objectContaining({
                params: {
                    action: "set",
                    configid: 0,
                    paramid: "eParamID_XPT_Destination2_Locked",
                    value: 1,
                },
            })
        );
        expect(axios.get).toHaveBeenNthCalledWith(
            2,
            "http://192.0.2.10:8080/config",
            expect.objectContaining({
                params: {
                    action: "get",
                    configid: 0,
                    paramid: "eParamID_XPT_Destination2_Locked",
                },
            })
        );
    });

    test("does not route until the worker has discovered matrix dimensions", async () => {
        const { api } = setup();

        await expect(api.route(0, 0)).rejects.toThrow("has not reported its matrix dimensions");
    });
});
