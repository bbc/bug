const express = require("express");
const request = require("supertest");

jest.mock("@services/group-add", () => jest.fn(async () => true));
jest.mock("@services/group-delete", () => jest.fn(async () => true));
jest.mock("@services/group-rename", () => jest.fn(async () => true));
jest.mock("@services/group-reorder", () => jest.fn(async () => true));
jest.mock("@services/group-set", () => jest.fn(async () => true));
jest.mock("@services/group-addbutton", () => jest.fn(async () => true));

const router = require("./groups");

describe("groups routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", router);

    test("POST /reorder/:type/ returns success", async () => {
        const response = await request(app).post("/reorder/1/").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /set/:groupType/:groupIndex returns success", async () => {
        const response = await request(app).post("/set/1/1").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /:groupType/:groupName returns success", async () => {
        const response = await request(app).post("/1/1").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("DELETE /:type/:groupName returns success", async () => {
        const response = await request(app).delete("/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /rename/:type/:groupName/:newGroupName returns success", async () => {
        const response = await request(app).get("/rename/1/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /addbutton/:type/:groupIndexes/:buttonIndex returns success", async () => {
        const response = await request(app).get("/addbutton/1/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
