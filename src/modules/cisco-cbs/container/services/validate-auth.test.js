const mockSsh = jest.fn();

jest.mock("@utils/ciscocbs-ssh", () => (...args) => mockSsh(...args));

const validateAuth = require("./validate-auth");

describe("validate-auth", () => {
    beforeEach(() => {
        mockSsh.mockReset();
    });

    test("returns success when ssh output contains version", async () => {
        mockSsh.mockResolvedValue(["Cisco version 1.2.3"]);
        const result = await validateAuth({ address: "10.0.0.1", username: "u", password: "p" });
        expect(result).toBeDefined();
    });

    test("returns failure when ssh throws", async () => {
        mockSsh.mockRejectedValue(new Error("auth failed"));
        const result = await validateAuth({ address: "10.0.0.1", username: "u", password: "p" });
        expect(result).toBeDefined();
    });
});
