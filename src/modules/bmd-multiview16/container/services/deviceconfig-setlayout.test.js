const mockConfigGet = jest.fn();
const mockConnect = jest.fn();
const mockSend = jest.fn();
const mockDelay = jest.fn();

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@utils/videohub-promise", () =>
    jest.fn().mockImplementation(() => ({
        connect: (...args) => mockConnect(...args),
        send: (...args) => mockSend(...args),
    }))
);
jest.mock("delay", () => (...args) => mockDelay(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const Videohub = require("@utils/videohub-promise");
const service = require("./deviceconfig-setlayout");

describe("deviceconfig-setlayout", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConnect.mockReset();
        mockSend.mockReset();
        mockDelay.mockReset();
        mockDelay.mockResolvedValue();
        Videohub.mockClear();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(undefined);
        await expect(service("3x3")).rejects.toThrow("failed to load config");
    });

    test("sends the layout command and the routing string for a known layout", async () => {
        mockConfigGet.mockResolvedValue({ address: "127.0.0.1", port: 9990, autolayout: "uk" });
        mockConnect.mockResolvedValue();
        mockSend.mockResolvedValue();

        await expect(service("2x2")).resolves.toBe(true);

        expect(mockSend).toHaveBeenCalledWith("CONFIGURATION", "layout: 2x2", true);
        expect(mockSend).toHaveBeenCalledWith("VIDEO OUTPUT ROUTING", "0 0\n1 2\n2 1\n3 3\n", true);
        expect(mockDelay).toHaveBeenCalledWith(1000);
    });

    test("skips the routing string when the layout is unknown", async () => {
        mockConfigGet.mockResolvedValue({ address: "127.0.0.1", port: 9990, autolayout: "uk" });
        mockConnect.mockResolvedValue();
        mockSend.mockResolvedValue();

        await expect(service("unknown")).resolves.toBe(true);

        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith("CONFIGURATION", "layout: unknown", true);
        expect(mockDelay).not.toHaveBeenCalled();
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockResolvedValue({ address: "127.0.0.1", port: 9990, autolayout: "uk" });
        mockConnect.mockRejectedValue(new Error("boom"));
        await expect(service("2x2")).rejects.toBeDefined();
    });
});
