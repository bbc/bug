jest.mock("./status-getdefault", () => jest.fn());

const statusGet = require("./status-get");
const statusGetDefault = require("./status-getdefault");

describe("status-get service", () => {
    test("exports a function", () => {
        expect(typeof statusGet).toBe("function");
    });

    test("returns summary status from default service", async () => {
        statusGetDefault.mockResolvedValue({ key: "defaultservice", message: "Panel configured and ready" });

        const result = await statusGet();

        expect(statusGetDefault).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ key: "defaultservice", message: "Panel configured and ready" }]);
    });
});
