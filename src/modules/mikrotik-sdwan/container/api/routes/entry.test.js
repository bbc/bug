const express = require("express");
const request = require("supertest");

jest.mock("@services/entry-list", () => jest.fn(async () => ([])));
jest.mock("@services/entry-setroute", () => jest.fn(async () => true));
jest.mock("@services/entry-delete", () => jest.fn(async () => true));
jest.mock("@services/entry-lock", () => jest.fn(async () => true));
jest.mock("@services/entry-add", () => jest.fn(async () => true));
jest.mock("@services/entry-unlock", () => jest.fn(async () => true));
jest.mock("@services/entry-setlabel", () => jest.fn(async () => true));
jest.mock("@services/entry-setgroup", () => jest.fn(async () => true));
jest.mock("@services/entry-clearconnections", () => jest.fn(async () => true));

const entryRouter = require("./entry");

describe("entry routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", entryRouter);

    test("GET / returns success response", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /add returns success response", async () => {
        const response = await request(app).post("/add").send({ address: "10.0.0.1" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /route returns success response", async () => {
        const response = await request(app).put("/route").send({ address: "10.0.0.1", list: "rtab-1" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("DELETE / returns success response", async () => {
        const response = await request(app).delete("/").send({ address: "10.0.0.1" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /lock returns success response", async () => {
        const response = await request(app).put("/lock").send({ address: "10.0.0.1" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /unlock returns success response", async () => {
        const response = await request(app).put("/unlock").send({ address: "10.0.0.1" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /setlabel returns success response", async () => {
        const response = await request(app).put("/setlabel").send({ address: "10.0.0.1", label: "A" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /setgroup returns success response", async () => {
        const response = await request(app).put("/setgroup").send({ address: "10.0.0.1", group: "office" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /clear returns success response", async () => {
        const response = await request(app).put("/clear").send({ address: "10.0.0.1" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
