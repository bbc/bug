const request = require("supertest");
const system = require("@bin/api");
const { promises: fs } = require("fs");
const path = require("path");

afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

const fetchExampleModuleName = async () => {
    const modulesFolder = path.join(__dirname, "..", "modules");
    const moduleList = await fs.readdir(modulesFolder);
    for (let eachModule of moduleList) {
        if (!eachModule.startsWith(".")) {
            return eachModule;
        }
    }
    return null;
};

describe("Test the '/api/module/' endpoint", () => {

    //TODO - Mock list images service so this can be a valid test
    test.skip("Test the '/' getall route", async () => {
        const exampleModuleName = await fetchExampleModuleName();
        const response = await request(system).get("/api/module/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toBeArray();
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0].name).toEqual(exampleModuleName);
    });

    test("Test the '/{moduleName}' route", async () => {
        const exampleModuleName = await fetchExampleModuleName();
        const response = await request(system).get(`/api/module/${exampleModuleName}`);
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
        expect(response.body.data.name).toEqual(exampleModuleName);
    });
});
