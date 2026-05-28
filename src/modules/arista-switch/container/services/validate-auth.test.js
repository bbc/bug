const mockAristaApi = jest.fn();
jest.mock("@utils/arista-api", () => (...args) => mockAristaApi(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@core/ValidationResult", () => function ValidationResult(items) { return { items }; });

const service = require("./validate-auth");

describe("validate-auth", () => {
    beforeEach(() => {
        mockAristaApi.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockAristaApi.mockRejectedValue(new Error("boom"));
        const result = await service({ address: "127.0.0.1", username: "u", password: "p" });
        expect(result).toBeDefined();
    });
});
