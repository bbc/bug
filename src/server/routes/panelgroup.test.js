const request = require("supertest");

jest.mock("@middleware/restrict", () => ({
    to: () => (req, res, next) => next(),
}));

jest.mock("@services/panelgroup-rename", () => jest.fn(async () => true));
jest.mock("@services/panelgroup-delete", () => jest.fn(async () => true));

const system = require("@bin/api");

describe("Test the '/api/panelgroup/' endpoint", () => {
    test("Test the '/:groupName/:newGroupName' PUT route", async () => {
        const response = await request(system).put("/api/panelgroup/oldGroup/newGroup");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeTrue();
    });

    test("Test the '/:groupName' DELETE route", async () => {
        const response = await request(system).delete("/api/panelgroup/newGroup");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeTrue();
    });
});
