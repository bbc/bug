const request = require("supertest");
const system = require("@bin/api");
const iconsSettings = require("@services/icons-settings");

afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

const testIcons = ["mdi-abacus", "access-alarm"];

describe("Test the '/api/icons/' endpoint", () => {
    test("Test the '/variants' route", async () => {
        const response = await request(system).get("/api/icons/variants");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toContain(iconsSettings.variants[0]);

    });

    test("Test the '/icons' getall route", async () => {
        const response = await request(system).get("/api/icons/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        for (let eachIcon of testIcons) {
            expect(response.body.data.icons).toContain(eachIcon);
        }

    });

    test("Test the '/icons' POST route with no parameters", async () => {
        const response = await request(system).post("/api/icons/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        for (let eachIcon of testIcons) {
            expect(response.body.data.icons).toContain(eachIcon);
        }
        const arrayLength = response.body.data.icons.length;
        expect(response.body.data.length).toEqual(arrayLength);

    });

    test("Test the '/icons/{iconName}' GET route", async () => {
        const response = await request(system).get(`/api/icons/${testIcons[0]}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.icons).toContain(testIcons[0]);
        expect(response.body.data.icons.length).toEqual(1);
        expect(response.body.data.length).toEqual(1);

    });

    test("Test the '/icons/{iconName}' POST route", async () => {
        const response = await request(system).post(`/api/icons/${testIcons[0]}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.icons).toContain(testIcons[0]);
        expect(response.body.data.icons.length).toEqual(1);
        expect(response.body.data.length).toEqual(1);

    });

    test("Test the '/icons' POST route with length parameter", async () => {
        const response = await request(system)
            .post("/api/icons/")
            .send({ length: 10 })
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.icons).toBeArray();
        expect(response.body.data.icons.length).toEqual(10);

    });

    test("Test the '/icons' POST route with variant parameter", async () => {
        const testVariant = iconsSettings.variants[0];
        const response = await request(system).post("/api/icons/").send({
            variant: testVariant,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.icons.length).toBeGreaterThan(0);
        expect(response.body.data.icons[0]).toEndWith(`-${testVariant}`);

    });
});
