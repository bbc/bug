const mockSpeedtest = jest.fn();

jest.mock("../utils/speedtest", () => (...args) => mockSpeedtest(...args));

const testStart = require("./test-start");

describe("test-start service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("starts speedtest and returns running response", () => {
        const result = testStart();

        expect(mockSpeedtest).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            data: { running: true },
            message: "Speedtest started",
        });
    });

    test("returns error object when speedtest throws", () => {
        const error = new Error("failed");
        mockSpeedtest.mockImplementation(() => {
            throw error;
        });

        const result = testStart();

        expect(result).toEqual({ error });
    });
});
