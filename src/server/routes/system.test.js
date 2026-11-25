const request = require("supertest");

jest.mock("@middleware/restrict", () => ({
    to: () => (_req, _res, next) => next(),
}));
jest.mock("@services/docker-cleanup", () => jest.fn());
jest.mock("@services/system-info", () => jest.fn());
jest.mock("@services/system-settings-get", () => jest.fn());
jest.mock("@services/system-settings-update", () => jest.fn());
jest.mock("@services/system-hosthealth", () => jest.fn());
jest.mock("@services/system-containerhealth", () => jest.fn());
jest.mock("@services/system-containers", () => jest.fn());

const dockerCleanup = require("@services/docker-cleanup");
const systemInfo = require("@services/system-info");
const systemSettingsGet = require("@services/system-settings-get");
const systemSettingsUpdate = require("@services/system-settings-update");
const systemHostHealth = require("@services/system-hosthealth");
const systemContainerHealth = require("@services/system-containerhealth");
const systemContainers = require("@services/system-containers");
const system = require("@bin/api");

describe("Test the '/api/system/' endpoint", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("Test the '/hello' GET route", async () => {
        const response = await request(system).get("/api/system/hello");
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toEqual("Good morning sunshine, the earth says hello.");
    });

    test.each([
        [true, "success"],
        [false, "failure"],
    ])("returns %s cleanup result as %s", async (result, status) => {
        dockerCleanup.mockResolvedValue(result);

        const response = await request(system).post("/api/system/cleanup");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ status, data: result }));
    });

    test("returns system information", async () => {
        systemInfo.mockResolvedValue({ data: { uptime: 123 } });

        const response = await request(system).get("/api/system/info");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ status: "success", data: { uptime: 123 } }));
    });

    test("returns settings and passes settings updates to the service", async () => {
        systemSettingsGet.mockResolvedValue({ data: { title: "BUG" } });
        systemSettingsUpdate.mockResolvedValue({ data: { title: "New title" } });

        const getResponse = await request(system).get("/api/system/settings");
        const putResponse = await request(system).put("/api/system/settings").send({ title: "New title" });

        expect(getResponse.body).toEqual(expect.objectContaining({ status: "success", data: { title: "BUG" } }));
        expect(systemSettingsUpdate).toHaveBeenCalledWith({ title: "New title" });
        expect(putResponse.body).toEqual(expect.objectContaining({ status: "success", data: { title: "New title" } }));
    });

    test("reports a failed settings update", async () => {
        systemSettingsUpdate.mockResolvedValue(false);

        const response = await request(system).put("/api/system/settings").send({ title: "New title" });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("failure");
    });

    test("returns container and host health results", async () => {
        systemContainers.mockResolvedValue({ data: [{ id: "container-1" }] });
        systemHostHealth.mockResolvedValue({ data: { cpu: 42 } });
        systemContainerHealth.mockResolvedValue({ data: [{ name: "panel-1" }] });

        const containers = await request(system).get("/api/system/containers");
        const host = await request(system).get("/api/system/hosthealth");
        const containerHealth = await request(system)
            .post("/api/system/containerhealth")
            .send({ sortField: "name", sortDirection: "asc", filters: { type: "panel" } });

        expect(containers.body.data).toEqual([{ id: "container-1" }]);
        expect(host.body.data).toEqual({ cpu: 42 });
        expect(containerHealth.body.data).toEqual([{ name: "panel-1" }]);
        expect(systemContainerHealth).toHaveBeenCalledWith("name", "asc", { type: "panel" });
    });
});
