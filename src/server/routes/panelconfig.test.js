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
jest.mock("@services/panelconfig-push", () => jest.fn(async () => true));

const panelConfigPush = require("@services/panelconfig-push");
const panelConfigModel = require("@models/panel-config");
const moduleGet = require("@services/module-get");
const system = require("@bin/api");

describe("Test the '/api/panelconfig/' endpoint", () => {
    let panel;

    beforeEach(async () => {
        panelConfigPush.mockClear();
        panel = {
            id: `test-${randomUUID()}`,
            module: "clock",
            title: "test-title",
            group: "test-group",
            description: "test-description",
        };
        const module = await moduleGet(panel.module);
        await panelConfigModel.set({ ...module.defaultconfig, ...panel, enabled: true, key: "test-key" });
    });

    afterEach(async () => {
        await fs.rm(path.join(__dirname, "../../../config/panels", `${panel.id}.json`), { force: true });
    });

    test("lists panel configurations", async () => {
        const response = await request(system).get("/api/panelconfig/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({ id: panel.id })]));
    });

    test("gets a panel configuration", async () => {
        const response = await request(system).get(`/api/panelconfig/${panel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toEqual(expect.objectContaining({ ...panel, needsConfigured: true }));
    });

    test("updates and retrieves panel configuration", async () => {
        const response = await request(system)
            .put(`/api/panelconfig/${panel.id}`)
            .send({ description: "new-test-description" });
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.delivery).toBe("not-required");

        const updated = await request(system).get(`/api/panelconfig/${panel.id}`);
        expect(updated.body.data).toEqual(
            expect.objectContaining({ ...panel, needsConfigured: false, description: "new-test-description" })
        );
    });

    test("reports a saved configuration as pending when delivery fails", async () => {
        const module = await moduleGet("pinger");
        await panelConfigModel.set({
            ...module.defaultconfig,
            ...panel,
            module: "pinger",
            enabled: true,
            key: "test-key",
        });
        panelConfigPush.mockRejectedValueOnce(new Error("container unavailable"));

        const response = await request(system).put(`/api/panelconfig/${panel.id}`).send({ description: "saved" });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBe(true);
        expect(response.body.delivery).toBe("pending");
        const saved = await panelConfigModel.get(panel.id);
        expect(saved.description).toBe("saved");
    });

    test("pushes a panel configuration", async () => {
        const response = await request(system).get(`/api/panelconfig/push/${panel.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBe(true);
        expect(panelConfigPush).toHaveBeenCalledWith(panel.id);
    });

    test("reports an unavailable container when explicitly pushing", async () => {
        panelConfigPush.mockResolvedValueOnce(false);

        const response = await request(system).get(`/api/panelconfig/push/${panel.id}`);

        expect(response.statusCode).toBe(409);
        expect(response.body.status).toBe("failure");
        expect(response.body.data).toBe(false);
    });
});
