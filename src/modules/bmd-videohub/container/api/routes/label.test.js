const express = require("express");
const request = require("supertest");

jest.mock("@services/videohub-setlabel", () => jest.fn(async () => true));
jest.mock("@services/videohub-setlabels", () => jest.fn(async () => true));
jest.mock("@services/videohub-getlabels", () => jest.fn(async () => true));
jest.mock("@services/videohub-getinputlabel", () => jest.fn(async () => true));
jest.mock("@services/videohub-getoutputlabel", () => jest.fn(async () => true));

const router = require("./label");

describe("label routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", router);

    test("GET /label/ returns success", async () => {
        const response = await request(app).get("/label/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /label/getsource/:index returns success", async () => {
        const response = await request(app).get("/label/getsource/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /label/getdestination/:index returns success", async () => {
        const response = await request(app).get("/label/getdestination/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /setlabel/:index/:type/:label? returns success", async () => {
        const response = await request(app).get("/setlabel/1/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /setmultiplelabels returns success", async () => {
        const response = await request(app).post("/setmultiplelabels").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
