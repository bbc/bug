const request = require("supertest");
const system = require("@bin/api");
const panelDelete = require("@services/panel-delete");
const panelAdd = require("@services/panel-add");
const testPanel = {
    module: "clock",
    id: "test",
    title: "test-title",
    group: "test-group",
    description: "test-description",
};
const newTestPanel = {
    module: "clock",
    id: "test",
    title: "test-title",
    group: "test-group",
    description: "new-test-description",
};

afterAll(async () => {
    try {
        await panelDelete(testPanel.id);
    } catch (error) { }

    await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

beforeAll(async () => {
    // remove any previous tests
    try {
        await panelDelete(testPanel.id);
    } catch (error) { }

    // create new testpanel
    await panelAdd(testPanel);
});

describe("Test the '/api/panel/' endpoint", () => {
    test("Test the '/' GET route", async () => {
        const response = await request(system).get("/api/panelconfig/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeArray();
        expect(response.body.data.length).toBeGreaterThan(0);

    });

    test("Test the '/{panelId}' GET route with the test panel", async () => {
        const response = await request(system).get(`/api/panelconfig/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.id).toEqual(testPanel.id);
        expect(response.body.data.module).toEqual(testPanel.module);
        expect(response.body.data.needsConfigured).toBeTrue();
        expect(response.body.data.title).toEqual(testPanel.title);
        expect(response.body.data.description).toEqual(testPanel.description);

    });

    test("Test the '/{panelId}' PUT route to update properties", async () => {
        const response = await request(system)
            .put(`/api/panelconfig/${newTestPanel.id}`)
            .send(newTestPanel)
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");

    });

    test("Check for updated properties", async () => {
        const response = await request(system).get(`/api/panelconfig/${newTestPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.id).toEqual(newTestPanel.id);
        expect(response.body.data.module).toEqual(newTestPanel.module);
        expect(response.body.data.needsConfigured).toBeFalse();
        expect(response.body.data.description).toEqual(newTestPanel.description);

    });

    test("Test the '/push/{panelId}' GET route", async () => {
        const response = await request(system).get(`/api/panelconfig/push/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data);

    });
});
