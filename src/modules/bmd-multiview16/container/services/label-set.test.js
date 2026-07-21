const mockConfigGet = jest.fn();
const mockConnect = jest.fn();
const mockSend = jest.fn();

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@utils/videohub-promise", () =>
    jest.fn().mockImplementation(() => ({
        connect: (...args) => mockConnect(...args),
        send: (...args) => mockSend(...args),
    }))
);
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./label-set");

describe("label-set", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConnect.mockReset();
        mockSend.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(undefined);
        await expect(service(0, "News UK")).rejects.toThrow("failed to load config");
    });

    test("connects and sends the input label command", async () => {
        mockConfigGet.mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        mockConnect.mockResolvedValue();
        mockSend.mockResolvedValue();

        await expect(service(0, "News UK")).resolves.toBe(true);

        expect(mockSend).toHaveBeenCalledWith("INPUT LABELS", "0 News UK", true);
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        mockConnect.mockRejectedValue(new Error("boom"));
        await expect(service(0, "News UK")).rejects.toBeDefined();
    });
});
