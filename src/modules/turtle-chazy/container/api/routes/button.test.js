const express = require("express");
const request = require("supertest");

const mockButtonRename = jest.fn(async () => true);
const mockButtonClearLabel = jest.fn(async () => true);
const mockButtonSetIcon = jest.fn(async () => true);

jest.mock("@services/button-rename", () => (...args) => mockButtonRename(...args));
jest.mock("@services/button-clearlabel", () => (...args) => mockButtonClearLabel(...args));
jest.mock("@services/button-seticon", () => (...args) => mockButtonSetIcon(...args));

const router = require("./button");

describe("button routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    beforeEach(() => {
        mockButtonRename.mockClear();
        mockButtonClearLabel.mockClear();
        mockButtonSetIcon.mockClear();
    });

    test("POST /rename/:buttonType/:device/:index calls buttonRename when name is provided", async () => {
        const response = await request(app)
            .post("/rename/source/dev-a/3")
            .send({ name: "My Source" });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockButtonRename).toHaveBeenCalledWith("source", "dev-a", 3, "My Source");
        expect(mockButtonClearLabel).not.toHaveBeenCalled();
    });

    test("POST /rename/:buttonType/:device/:index calls buttonClearLabel when name is empty", async () => {
        const response = await request(app)
            .post("/rename/destination/dev-b/5")
            .send({ name: "  " });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockButtonClearLabel).toHaveBeenCalledWith("destination", "dev-b", 5);
        expect(mockButtonRename).not.toHaveBeenCalled();
    });

    test("POST /seticon/:buttonType/:device/:index calls buttonSetIcon", async () => {
        const response = await request(app)
            .post("/seticon/source/dev-a/2")
            .send({ icon: "star", color: "red" });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockButtonSetIcon).toHaveBeenCalledWith("source", "dev-a", 2, "star", "red");
    });
});
