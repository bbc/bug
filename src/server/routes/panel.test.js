const request = require("supertest");
const { randomUUID } = require("crypto");
const { promises: fs } = require("fs");
const path = require("path");

jest.mock("@services/docker-listimages", () => jest.fn(async () => []));
jest.mock("@models/docker-container", () => ({
    get: jest.fn(async () => null),
    list: jest.fn(async () => []),
    set: jest.fn(async () => true),
    setMultiple: jest.fn(async () => true),
}));
jest.mock("@services/panel-start", () => jest.fn(jest.requireActual("@services/panel-start")));

const panelStart = require("@services/panel-start");
const panelConfigModel = require("@models/panel-config");
const moduleGet = require("@services/module-get");
const system = require("@bin/api");

describe("Test the '/api/panel/' endpoint", () => {
    let panel;
    let createdPanelId;

    beforeEach(async () => {
        panelStart.mockClear();
        panel = {
            id: `test-${randomUUID()}`,
            module: "clock",
            title: "test-title",
            group: "test-group",
            description: "test-description",
        };
        createdPanelId = `test-${randomUUID()}`;
        const module = await moduleGet(panel.module);
        await panelConfigModel.set({ ...module.defaultconfig, ...panel, enabled: true, key: "test-key" });
    });

    afterEach(async () => {
        try {
            await Promise.all(panelStart.mock.results.map((result) => result.value));
        } finally {
            await fs.rm(path.join(__dirname, "../../../config/panels", `${panel.id}.json`), { force: true });
            await fs.rm(path.join(__dirname, "../../../config/panels", `${createdPanelId}.json`), { force: true });
        }
    });

    test("creates a panel", async () => {
        const response = await request(system)
            .post("/api/panel/")
            .send({ ...panel, id: createdPanelId });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        const config = await panelConfigModel.get(createdPanelId);
        expect(config).toEqual(expect.objectContaining({ id: createdPanelId, module: "clock", title: panel.title }));
    });

    test("lists panels", async () => {
        const response = await request(system).get("/api/panel/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({ id: panel.id })]));
    });

    test("gets a panel", async () => {
        const response = await request(system).get(`/api/panel/${panel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toEqual(
            expect.objectContaining({
                ...panel,
                enabled: true,
                _module: expect.objectContaining({ name: "clock" }),
                _dockerContainer: expect.objectContaining({
                    _isRunning: false,
                    _isBuilding: false,
                    _isBuilt: false,
                    _status: "active",
                }),
            })
        );
        expect(response.body.data._buildStatus).toBeNil();
    });

    test.each(["start", "stop"])("%ss a panel", async (action) => {
        const response = await request(system).get(`/api/panel/${action}/${panel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("updates a panel group", async () => {
        const response = await request(system).get(`/api/panel/group/${panel.id}/newTestGroup`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");

        const updated = await request(system).get(`/api/panel/${panel.id}`);
        expect(updated.body.data.group).toBe("newTestGroup");
    });

    test("disables a panel", async () => {
        const response = await request(system).get(`/api/panel/disable/${panel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");

        const updated = await request(system).get(`/api/panel/${panel.id}`);
        expect(updated.body.data.enabled).toBe(false);
    });

    test("enables a disabled panel", async () => {
        const config = await panelConfigModel.get(panel.id);
        await panelConfigModel.set({ ...config, enabled: false });

        const response = await request(system).get(`/api/panel/enable/${panel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");

        const updated = await request(system).get(`/api/panel/${panel.id}`);
        expect(updated.body.data.enabled).toBe(true);
    });

    test("deletes a panel", async () => {
        const response = await request(system).delete(`/api/panel/${panel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        await expect(fs.stat(path.join(__dirname, "../../../config/panels", `${panel.id}.json`))).rejects.toMatchObject(
            {
                code: "ENOENT",
            }
        );
    });
});
