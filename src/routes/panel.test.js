const request = require("supertest");
const system = require("@bin/api");
const panelDelete = require("@services/panel-delete");
const testPanel = {
    module: "clock",
    id: "test",
    title: "test-title",
    group: "test-group",
    description: "test-description",
};
const path = require("path");
const { promises: fs } = require("fs");

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

const listFiles = async () => {
    console.log("-------------------- listFiles START -----------------------------");
    const configFolder = path.join(__dirname, "..", "config");
    console.log("configFolder");
    console.log(JSON.stringify(configFolder));

    // check the cache first
    const panelArray = [];

    files = await fs.readdir(configFolder);
    console.log("files");
    console.log(JSON.stringify(files));

    for (let i in files) {
        const filename = path.join(configFolder, files[i]);
        if (filename.endsWith(".json")) {
            panelArray.push(filename);
        }
    }
    console.log("panelArray");
    console.log(panelArray);
    console.log("-------------------- listFiles END -----------------------------");
};

describe("Test the '/api/panel/' endpoint", () => {
    console.log("--------- 0");
    test(`Test the '/' POST route to create an example ${testPanel.module} panel`, async (done) => {
        console.log("--------- 1");
        await listFiles();
        console.log("creating test module");
        console.log(testPanel);
        const response = await request(system)
            .post("/api/panel/")
            .send(testPanel)
            .set("Content-Type", "application/json");
        console.log("test module create response:");
        await listFiles();
        expect(response.statusCode).toBe(200);
        console.log(response.body);
        done();
    });

    test("Test the '/' GET route", async (done) => {
        console.log("--------- 2");
        await listFiles();
        const response = await request(system).get("/api/panel/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeArray();
        expect(response.body.data.length).toBeGreaterThan(0);
        console.log(response.body);
        done();
    });

    test("Test the '/{panelId}' GET route with the test panel", async (done) => {
        console.log("--------- 3");
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
        console.log(response.body);
        done();
    });

    test("Test the '/start/{panelId}' GET route with the test panel", async (done) => {
        console.log("--------- 4");
        const response = await request(system).get(`/api/panel/start/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        console.log(response.body);
        done();
    });

    test("Test the '/stop/{panelId}' GET route with the test panel", async (done) => {
        console.log("--------- 5");
        const response = await request(system).get(`/api/panel/stop/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        console.log(response.body);
        done();
    });

    test("Test the '/group/{panelId}' GET route to set the group with the test panel", async (done) => {
        console.log("--------- 6");
        const response = await request(system).get(`/api/panel/group/${testPanel.id}/newTestGroup`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        console.log(response.body);
        done();
    });

    test("Check the panel for the new group", async (done) => {
        console.log("--------- 7");
        const response = await request(system).get(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.group).toEqual("newTestGroup");
        console.log(response.body);
        done();
    });

    test("Test the '/disable/{panelId}' GET route with the test panel", async (done) => {
        console.log("--------- 8");
        const response = await request(system).get(`/api/panel/disable/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        console.log(response.body);
        done();
    });

    test("Check the panel is disabled", async (done) => {
        console.log("--------- 9");
        const response = await request(system).get(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.enabled).toBeFalse();
        console.log(response.body);
        done();
    });

    test("Test the '/enable/{panelId}' GET route with the test panel", async (done) => {
        console.log("--------- 10");
        const response = await request(system).get(`/api/panel/enable/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        console.log(response.body);
        done();
    });

    test("Check the panel is enabled", async (done) => {
        console.log("--------- 11");
        const response = await request(system).get(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeObject();
        expect(response.body.data.enabled).toBeTrue();
        console.log(response.body);
        done();
    });

    test("Test the '/{panelId}' DELETE route with the test panel", async (done) => {
        console.log("--------- 12");
        const response = await request(system).delete(`/api/panel/${testPanel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        console.log(response.body);
        done();
    });
});
