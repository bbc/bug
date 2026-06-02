const request = require("supertest");

jest.mock("@middleware/restrict", () => ({
    to: () => (req, res, next) => next(),
}));

jest.mock("@services/strategy-list", () => jest.fn(async () => [{ type: "local", enabled: true }]));
jest.mock("@services/strategy-listsafe", () => jest.fn(async () => [{ type: "local", enabled: true }]));
jest.mock("@services/strategy-reorder", () => jest.fn(async () => true));
jest.mock("@services/strategy-get", () => jest.fn(async () => ({ type: "local", enabled: true })));
jest.mock("@services/strategy-getsafe", () => jest.fn(async () => ({ type: "local", enabled: true })));
jest.mock("@services/strategy-state", () => jest.fn(async () => true));
jest.mock("@services/strategy-update", () => jest.fn(async () => true));

const system = require("@bin/api");

describe("Test the '/api/strategy/' endpoint", () => {
    test("Test the '/' GET route", async () => {
        const response = await request(system).get("/api/strategy/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/safe/' GET route", async () => {
        const response = await request(system).get("/api/strategy/safe/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/reorder' POST route", async () => {
        const response = await request(system)
            .post("/api/strategy/reorder")
            .send({ strategies: ["local"] })
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:type' GET route", async () => {
        const response = await request(system).get("/api/strategy/local");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/safe/:type' GET route", async () => {
        const response = await request(system).get("/api/strategy/safe/local");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:type/enable' GET route", async () => {
        const response = await request(system).get("/api/strategy/local/enable");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:type/disable' GET route", async () => {
        const response = await request(system).get("/api/strategy/local/disable");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:type' PUT route", async () => {
        const response = await request(system)
            .put("/api/strategy/local")
            .send({ enabled: true })
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });
});
