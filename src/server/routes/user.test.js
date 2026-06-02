const request = require("supertest");

jest.mock("@middleware/restrict", () => ({
    to: () => (req, res, next) => next(),
}));

jest.mock("@services/user-delete", () => jest.fn(async () => true));
jest.mock("@services/user-set", () => jest.fn(async () => true));
jest.mock("@services/user-update", () => jest.fn(async () => true));
jest.mock("@services/user-list", () => jest.fn(async () => [{ id: "user-1", username: "tester" }]));
jest.mock("@services/user-get", () => jest.fn(async () => ({ id: "user-1", username: "tester" })));
jest.mock("@services/user-enable", () => jest.fn(async () => true));
jest.mock("@services/user-getproxyid", () => jest.fn(async () => ({ username: "tester" })));

const system = require("@bin/api");

describe("Test the '/api/user/' endpoint", () => {
    test("Test the '/current' GET route", async () => {
        const response = await request(system).get("/api/user/current");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/getproxyid' GET route", async () => {
        const response = await request(system).get("/api/user/getproxyid");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/' GET route", async () => {
        const response = await request(system).get("/api/user/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/list/' POST route", async () => {
        const response = await request(system)
            .post("/api/user/list/")
            .send({ sortField: "username", sortDirection: "asc", filters: {} })
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:id' GET route", async () => {
        const response = await request(system).get("/api/user/user-1");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:id/enable' GET route", async () => {
        const response = await request(system).get("/api/user/user-1/enable");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:id/disable' GET route", async () => {
        const response = await request(system).get("/api/user/user-1/disable");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/' POST route", async () => {
        const response = await request(system)
            .post("/api/user/")
            .send({ username: "newuser" })
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/current' PUT route", async () => {
        const response = await request(system)
            .put("/api/user/current")
            .send({ firstName: "Test" })
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:id' PUT route", async () => {
        const response = await request(system)
            .put("/api/user/user-1")
            .send({ firstName: "Updated" })
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("Test the '/:id' DELETE route", async () => {
        const response = await request(system).delete("/api/user/user-1");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });
});
