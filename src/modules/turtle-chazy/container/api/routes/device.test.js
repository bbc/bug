const express = require("express");
const request = require("supertest");

const mockDeviceRename = jest.fn(async () => true);
jest.mock("@services/device-rename", () => (...args) => mockDeviceRename(...args));

const router = require("./device");

describe("device routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    beforeEach(() => {
        mockDeviceRename.mockClear();
    });

    test("POST /rename/:device returns success and trims name", async () => {
        const response = await request(app)
            .post("/rename/dev-a")
            .send({ name: "  new-name  " });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockDeviceRename).toHaveBeenCalledWith("dev-a", "new-name");
    });
});
