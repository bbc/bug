const express = require("express");
const request = require("supertest");

jest.mock("@services/label-list", () => jest.fn(async () => []));
jest.mock("@services/label-set", () => jest.fn(async () => true));
jest.mock("@services/label-getrouteroutputs", () => jest.fn(async () => []));
jest.mock("@services/label-setautostate", () => jest.fn(async () => true));
jest.mock("@services/label-setautoindex", () => jest.fn(async () => true));

const labelSetAutoIndex = require("@services/label-setautoindex");
const router = require("./label");

describe("label routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    beforeEach(() => {
        labelSetAutoIndex.mockReset();
    });

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /getrouteroutputs returns success", async () => {
        const response = await request(app).get("/getrouteroutputs");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /set returns success", async () => {
        const response = await request(app).post("/set").send({ inputIndex: 1, label: "A" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /setautostate returns success", async () => {
        const response = await request(app).post("/setautostate").send({ inputIndex: 1, state: true });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /setautoindex returns success when service resolves true", async () => {
        labelSetAutoIndex.mockResolvedValueOnce(true);
        const response = await request(app).post("/setautoindex").send({ inputIndex: 1, routerIndex: 2 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /setautoindex returns failure when service resolves false", async () => {
        labelSetAutoIndex.mockResolvedValueOnce(false);
        const response = await request(app).post("/setautoindex").send({ inputIndex: 1, routerIndex: 2 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "failure");
    });
});
