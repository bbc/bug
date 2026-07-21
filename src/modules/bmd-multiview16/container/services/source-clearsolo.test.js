const mockDeviceConfigSet = jest.fn();
const mockDelay = jest.fn();

jest.mock("@services/deviceconfig-set", () => (...args) => mockDeviceConfigSet(...args));
jest.mock("delay", () => (...args) => mockDelay(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./source-clearsolo");

describe("source-clearsolo", () => {
    beforeEach(() => {
        mockDeviceConfigSet.mockReset();
        mockDelay.mockReset();
        mockDelay.mockResolvedValue();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("disables solo on the device", async () => {
        mockDeviceConfigSet.mockResolvedValue(true);
        await service();
        expect(mockDeviceConfigSet).toHaveBeenCalledWith("Solo enabled", "false");
    });

    test("handles dependency exceptions", async () => {
        mockDeviceConfigSet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});
