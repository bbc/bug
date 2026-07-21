const mockConnect = jest.fn();
const mockSend = jest.fn();
const mockOn = jest.fn();

jest.mock("@utils/videohub-promise", () =>
    jest.fn().mockImplementation(() => ({
        connect: (...args) => mockConnect(...args),
        send: (...args) => mockSend(...args),
        on: (...args) => mockOn(...args),
    }))
);
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const Videohub = require("@utils/videohub-promise");
const service = require("./videohub-test");

describe("videohub-test", () => {
    beforeEach(() => {
        mockConnect.mockReset();
        mockSend.mockReset();
        mockOn.mockReset();
        Videohub.mockClear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("resolves true when an update event is received", async () => {
        mockConnect.mockResolvedValue();
        let updateHandler;
        mockOn.mockImplementation((event, handler) => {
            if (event === "update") {
                updateHandler = handler;
            }
        });

        const promise = service("127.0.0.1", 9990);
        await Promise.resolve();
        updateHandler();

        await expect(promise).resolves.toBe(true);
        expect(Videohub).toHaveBeenCalledWith({ host: "127.0.0.1", port: 9990 });
    });

    test("resolves false after ping attempts are exhausted", async () => {
        mockConnect.mockResolvedValue();
        mockOn.mockImplementation(() => {});

        const promise = service("127.0.0.1", 9990);
        await Promise.resolve();
        await jest.runAllTimersAsync();

        await expect(promise).resolves.toBe(false);
        expect(mockSend).toHaveBeenCalledWith("PING");
    });

    test("handles dependency exceptions", async () => {
        mockConnect.mockRejectedValue(new Error("boom"));
        await expect(service("127.0.0.1", 9990)).rejects.toBeDefined();
    });
});
