jest.mock("@core/write-json", () => jest.fn());
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const writeJson = require("@core/write-json");
const configPut = require("./config-put");

describe("container configuration update", () => {
    beforeEach(() => jest.resetAllMocks());

    test("does not acknowledge or update workers when writing the config fails", async () => {
        writeJson.mockResolvedValue(false);
        const workers = { pushConfig: jest.fn() };

        await expect(configPut(workers, { id: "panel" })).resolves.toBe(false);
        expect(workers.pushConfig).not.toHaveBeenCalled();
    });

    test("acknowledges a saved config only after the worker manager accepts it", async () => {
        writeJson.mockResolvedValue(true);
        const workers = { pushConfig: jest.fn().mockRejectedValue(new Error("worker update failed")) };

        await expect(configPut(workers, { id: "panel" })).resolves.toBe(false);
    });
});
