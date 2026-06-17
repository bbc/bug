const mockMongoSet = jest.fn();

jest.mock("@core/mongo-single", () => ({
    set: (...args) => mockMongoSet(...args),
}));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const deviceSetPending = require("./device-setpending");

describe("device-setpending", () => {
    beforeEach(() => {
        mockMongoSet.mockReset();
    });

    test("sets pending state", async () => {
        mockMongoSet.mockResolvedValue(undefined);
        await expect(deviceSetPending(true)).resolves.toBeUndefined();
        expect(mockMongoSet).toHaveBeenCalledWith("pending", true, 60);
    });

    test("rejects when mongo write fails", async () => {
        mockMongoSet.mockRejectedValue(new Error("write failed"));
        await expect(deviceSetPending(false)).rejects.toThrow("write failed");
    });
});
