jest.mock("@utils/ciscosg-ssh", () => jest.fn(async () => ["Copy succeeded"]));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const mockConfigGet = jest.fn();
const mockDeviceSetPending = jest.fn(async () => undefined);

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@services/device-setpending", () => mockDeviceSetPending);

const deviceSave = require("./device-save");

describe("device-save exception handling", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockDeviceSetPending.mockClear();
    });

    test("rejects when config-get throws", async () => {
        mockConfigGet.mockRejectedValue(new Error("config exploded"));

        await expect(deviceSave()).rejects.toThrow("config exploded");
    });

    test("rejects when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(deviceSave()).rejects.toThrow("failed to load config");
    });

    test("rejects when save response does not confirm success", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1", username: "u", password: "p" });

        jest.requireMock("@utils/ciscosg-ssh").mockResolvedValue(["bad output"]);

        await expect(deviceSave()).rejects.toThrow("device did not confirm save");
    });
});
