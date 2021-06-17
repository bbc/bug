const request = require("supertest");
const system = require("@bin/api");
const panelDelete = require("@services/panel-delete");
const panelList = require("@services/panel-list");
const testPanel = {
    module: "clock",
    id: "test",
    title: "test-title",
    group: "test-group",
    description: "test-description",
};

afterAll(async () => {
    try {
        await panelDelete(testPanel.id);
    } catch (error) {}
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

beforeAll(async () => {
    // remove any previous tests
    try {
        await panelDelete(testPanel.id);
    } catch (error) {}
});

describe("Test the '/api/panel/' endpoint", () => {
    test(`Test the '/' POST route to create an example ${testPanel.module} panel`, async (done) => {
        const response = await request(system)
            .post("/api/panel/")
            .send(testPanel)
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        done();
    });

    test("Test the '/' GET route", async (done) => {
        const response = await request(system).get("/api/panel/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeArray();
        expect(response.body.data.length).toBeGreaterThan(0);
        done();
    });

    test("Test the '/{panelId}' GET route with the test panel", async (done) => {
        const response = await request(system).get(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.id).toEqual(testPanel.id);
        expect(response.body.data.module).toEqual(testPanel.module);
        expect(response.body.data.title).toEqual(testPanel.title);
        expect(response.body.data.group).toEqual(testPanel.group);
        expect(response.body.data.description).toEqual(testPanel.description);
        //TODO - when this changes expect(response.body.data.enabled).toBeTrue();
        expect(response.body.data._module).toBeObject();
        expect(response.body.data._module.name).toEqual(testPanel.module);
        expect(response.body.data._dockerContainer).toBeObject();
        expect(response.body.data._dockerContainer._isRunning).toBeFalse();
        expect(response.body.data._dockerContainer._isBuilding).toBeFalse();
        expect(response.body.data._dockerContainer._isBuilt).toBeFalse();
        expect(response.body.data._dockerContainer._status).toEqual("idle");
        expect(response.body.data._buildStatus).toBeNil();
        done();
    });

    test("Test the '/start/{panelId}' GET route with the test panel", async (done) => {
        const response = await request(system).get(`/api/panel/start/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        done();
    });

    test("Test the '/stop/{panelId}' GET route with the test panel", async (done) => {
        const response = await request(system).get(`/api/panel/stop/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        done();
    });

    test("Test the '/group/{panelId}' GET route to set the group with the test panel", async (done) => {
        const response = await request(system).get(`/api/panel/group/${testPanel.id}/newTestGroup`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        done();
    });

    test("Check the panel for the new group", async (done) => {
        const response = await request(system).get(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.group).toEqual("newTestGroup");
        done();
    });

    test("Test the '/disable/{panelId}' GET route with the test panel", async (done) => {
        const response = await request(system).get(`/api/panel/disable/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        done();
    });

    test("Check the panel is disabled", async (done) => {
        const response = await request(system).get(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.enabled).toBeFalse();
        done();
    });

    test("Test the '/enable/{panelId}' GET route with the test panel", async (done) => {
        const response = await request(system).get(`/api/panel/enable/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        done();
    });

    test("Check the panel is enabled", async (done) => {
        const response = await request(system).get(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.enabled).toBeTrue();
        done();
    });

    test("Test the '/{panelId}' DELETE route with the test panel", async (done) => {
        const response = await request(system).delete(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        done();
    });
});
