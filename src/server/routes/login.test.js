const request = require("supertest");
const passport = require("passport");

jest.mock("@services/strategy-list", () => jest.fn(async () => []));
jest.mock("@services/user-get", () => jest.fn(async () => ({ id: "user-1", username: "tester" })));

const userGet = require("@services/user-get");
const strategyList = require("@services/strategy-list");
const authenticateSpy = jest.spyOn(passport, "authenticate");

const system = require("@bin/api");

describe("Test the '/api/login/' endpoint", () => {
    afterEach(() => {
        authenticateSpy.mockReset();
        userGet.mockClear();
        strategyList.mockClear();
    });

    test("Test successful login", async () => {
        authenticateSpy.mockImplementation((_strategies, callback) => {
            return () => callback(null, "user-1", null);
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
        authenticateSpy.mockImplementation((_strategies, callback) => {
            return () => callback(null, null, null);
        });

        const response = await request(system)
            .post("/api/login/")
            .send({ username: "tester", password: "bad" })
            .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("failure");
        expect(userGet).not.toHaveBeenCalled();
    });

    test("passes authentication errors to the error handler", async () => {
        authenticateSpy.mockImplementation((_strategies, callback) => {
            return () => callback(new Error("authentication failed"));
        });

        const response = await request(system).post("/api/login/").send({ username: "tester", password: "password" });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ status: "error", message: "authentication failed" });
        expect(userGet).not.toHaveBeenCalled();
    });

    test("passes session login errors to the error handler", async () => {
        authenticateSpy.mockImplementation((_strategies, callback) => {
            return (req) => {
                req.logIn = (_id, done) => done(new Error("session failed"));
                return callback(null, "user-1", null);
            };
        });

        const response = await request(system).post("/api/login/").send({ username: "tester", password: "password" });

        expect(userGet).toHaveBeenCalledWith("user-1");
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ status: "error", message: "session failed" });
    });

    test("passes strategy lookup failures to the error handler", async () => {
        strategyList.mockRejectedValueOnce(new Error("strategy lookup failed"));

        const response = await request(system).post("/api/login/").send({ username: "tester", password: "password" });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ status: "error", message: "strategy lookup failed" });
        expect(authenticateSpy).not.toHaveBeenCalled();
    });

    test("passes user lookup failures to the error handler without logging in", async () => {
        const logIn = jest.fn();
        userGet.mockRejectedValueOnce(new Error("user lookup failed"));
        authenticateSpy.mockImplementation((_strategies, callback) => {
            return (req) => {
                req.logIn = logIn;
                callback(null, "user-1", null);
            };
        });

        const response = await request(system).post("/api/login/").send({ username: "tester", password: "password" });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ status: "error", message: "user lookup failed" });
        expect(logIn).not.toHaveBeenCalled();
    });
});
