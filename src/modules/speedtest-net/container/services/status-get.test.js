const statusGet = require("./status-get");

describe("status-get service", () => {
    test("exports a function", () => {
        expect(typeof statusGet).toBe("function");
    });

    test("returns an empty array", async () => {
        const result = await statusGet();
        expect(result).toEqual([]);
    });
});
