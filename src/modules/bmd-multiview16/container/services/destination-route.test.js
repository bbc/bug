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

const Videohub = require("@utils/videohub-promise");
const service = require("./destination-route");

describe("destination-route", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConnect.mockReset();
        mockSend.mockReset();
        Videohub.mockClear();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(undefined);
        await expect(service(1, 2)).rejects.toThrow("failed to load config");
    });

    test("connects and sends the routing command", async () => {
        mockConfigGet.mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        mockConnect.mockResolvedValue();
        mockSend.mockResolvedValue();

        await expect(service(3, 5)).resolves.toBe(true);

        expect(Videohub).toHaveBeenCalledWith({ host: "127.0.0.1", port: 9990 });
        expect(mockConnect).toHaveBeenCalled();
        expect(mockSend).toHaveBeenCalledWith("VIDEO OUTPUT ROUTING", "3 5", true);
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        mockConnect.mockRejectedValue(new Error("boom"));
        await expect(service(3, 5)).rejects.toBeDefined();
    });
});
