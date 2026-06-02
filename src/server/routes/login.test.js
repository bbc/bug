const request = require("supertest");
const passport = require("passport");

jest.mock("@services/strategy-list", () => jest.fn(async () => []));
jest.mock("@services/user-get", () => jest.fn(async () => ({ id: "user-1", username: "tester" })));

const authenticateSpy = jest.spyOn(passport, "authenticate");

const system = require("@bin/api");

describe("Test the '/api/login/' endpoint", () => {
    afterEach(() => {
        authenticateSpy.mockReset();
    });

    test("Test successful login", async () => {
        authenticateSpy.mockImplementation((strategies, callback) => {
            return (req, res, next) => callback(null, "user-1", null);
        });

        const response = await request(system)
            .post("/api/login/")
            .send({ username: "tester", password: "password" })
            .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.username).toBe("tester");
    });

    test("Test failed login", async () => {
        authenticateSpy.mockImplementation((strategies, callback) => {
            return (req, res, next) => callback(null, null, null);
        });

        const response = await request(system)
            .post("/api/login/")
            .send({ username: "tester", password: "bad" })
            .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("failure");
    });
});
