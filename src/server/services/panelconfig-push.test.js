jest.mock("@models/panel-config", () => ({ get: jest.fn() }));
jest.mock("@utils/docker", () => ({ getContainer: jest.fn() }));
jest.mock("axios", () => ({ put: jest.fn() }));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), warning: jest.fn() }));

const panelConfigModel = require("@models/panel-config");
const docker = require("@utils/docker");
const axios = require("axios");
const delivery = require("./panelconfig-delivery");
const push = require("./panelconfig-push");

describe("panel configuration delivery", () => {
    let config;
    let container;
    let inspect;

    beforeEach(() => {
        jest.resetAllMocks();
        config = { id: "panel-1", enabled: true, address: "old" };
        container = { Id: "container-1", State: { Running: true, StartedAt: "first" } };
        inspect = jest.fn(async () => container);
        docker.getContainer.mockReturnValue({ inspect });
        panelConfigModel.get.mockImplementation(async () => ({ ...config }));
        axios.put.mockResolvedValue({ status: 200, data: { status: "success", data: true } });
        delivery.clear(config.id);
    });

    test("marks a configuration accepted only after the container acknowledges it", async () => {
        await expect(push(config.id)).resolves.toBe(true);
        expect(delivery.get(config, true)).toBe("accepted");
        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining("/api/config"),
            config,
            expect.objectContaining({ timeout: 5000 })
        );
    });

    test.each([
        { status: 200, data: { status: "success", data: false } },
        { status: 200, data: { status: "failure", data: true } },
    ])("does not accept an unsuccessful container response", async (response) => {
        axios.put.mockResolvedValue(response);

        await expect(push(config.id)).rejects.toThrow("Container did not accept");
        expect(delivery.get(config, true)).toBe("pending");
    });

    test("keeps delivery pending if the container is stopped or missing", async () => {
        container.State.Running = false;
        await expect(push(config.id)).resolves.toBe(false);
        inspect.mockRejectedValue({ statusCode: 404 });
        await expect(push(config.id)).resolves.toBe(false);
        expect(delivery.get(config, true)).toBe("pending");
        expect(axios.put).not.toHaveBeenCalled();
    });

    test("retries after failure and only redelivers when configuration or container changes", async () => {
        axios.put.mockRejectedValueOnce(new Error("not ready"));
        await expect(push(config.id, { onlyIfNeeded: true })).rejects.toThrow("not ready");
        await expect(push(config.id, { onlyIfNeeded: true })).resolves.toBe(true);
        await push(config.id, { onlyIfNeeded: true });
        expect(axios.put).toHaveBeenCalledTimes(2);

        config.address = "new";
        expect(delivery.get(config, true)).toBe("pending");
        await push(config.id, { onlyIfNeeded: true });
        container.State.StartedAt = "second";
        await push(config.id, { onlyIfNeeded: true });
        expect(axios.put).toHaveBeenCalledTimes(4);
    });

    test("serializes pushes and reads the latest configuration for the next attempt", async () => {
        let finishFirst;
        axios.put.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finishFirst = resolve;
                })
        );

        const first = push(config.id);
        while (!finishFirst) await new Promise((resolve) => setImmediate(resolve));
        config.address = "new";
        const second = push(config.id);
        finishFirst({ status: 200, data: { status: "success", data: true } });
        await Promise.all([first, second]);

        expect(axios.put.mock.calls[0][1].address).toBe("old");
        expect(axios.put.mock.calls[1][1].address).toBe("new");
        expect(delivery.get(config, true)).toBe("accepted");
    });
});
