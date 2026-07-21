const mockDestinationRoute = jest.fn();
const mockDeviceConfigSet = jest.fn();
const mockDelay = jest.fn();

jest.mock("@services/destination-route", () => (...args) => mockDestinationRoute(...args));
jest.mock("@services/deviceconfig-set", () => (...args) => mockDeviceConfigSet(...args));
jest.mock("delay", () => (...args) => mockDelay(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./source-setsolo");

describe("source-setsolo", () => {
    beforeEach(() => {
        mockDestinationRoute.mockReset();
        mockDeviceConfigSet.mockReset();
        mockDelay.mockReset();
        mockDelay.mockResolvedValue();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("routes the solo output and enables solo on the device", async () => {
        mockDestinationRoute.mockResolvedValue(true);
        mockDeviceConfigSet.mockResolvedValue(true);

        await service(4);

        expect(mockDestinationRoute).toHaveBeenCalledWith(16, 4);
        expect(mockDeviceConfigSet).toHaveBeenCalledWith("Solo enabled", "true");
    });

    test("handles dependency exceptions", async () => {
        mockDestinationRoute.mockRejectedValue(new Error("boom"));
        await expect(service(4)).rejects.toBeDefined();
    });
});
