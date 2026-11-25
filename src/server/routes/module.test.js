const request = require("supertest");

jest.mock("@services/docker-listimages", () => jest.fn(async () => []));

const cacheStore = require("@core/cache-store");
const system = require("@bin/api");

describe("Test the '/api/module/' endpoint", () => {
    beforeEach(() => {
        cacheStore.del("moduleConfig");
    });

    test("Test the '/' getall route", async () => {
        const response = await request(system).get("/api/module/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({ name: "clock" })]));
    });

    test("Test the '/{moduleName}' route", async () => {
        const response = await request(system).get("/api/module/clock");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data).toContainKeys([
            "name",
            "longname",
            "description",
            "needsContainer",
            "devmounts",
            "protectedRoutes",
            "defaultconfig",
        ]);
        expect(response.body.data.name).toEqual("clock");
    });
});
