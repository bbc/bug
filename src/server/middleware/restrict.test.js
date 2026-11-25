jest.mock("@services/strategy-getenabledcount", () => jest.fn());
jest.mock("@services/user-get", () => jest.fn());
jest.mock("@services/panelconfig-checkkey", () => jest.fn());
jest.mock("@services/panel-ispublicroute", () => jest.fn());
jest.mock("@core/logger", () => () => ({ warning: jest.fn(), error: jest.fn() }));

const strategyGetEnabledCount = require("@services/strategy-getenabledcount");
const userGet = require("@services/user-get");
const panelCheckKey = require("@services/panelconfig-checkkey");
const isPublicRoute = require("@services/panel-ispublicroute");
const restrict = require("./restrict");

describe("restrict middleware", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        jest.resetAllMocks();
        strategyGetEnabledCount.mockResolvedValue(1);
        isPublicRoute.mockResolvedValue(false);
        panelCheckKey.mockResolvedValue(null);
        req = {
            params: { panelid: "panel-1" },
            path: "/status",
            headers: {},
            isAuthenticated: jest.fn().mockReturnValue(false),
            logout: jest.fn((callback) => callback()),
            user: "user-1",
            ip: "127.0.0.1",
            protocol: "http",
            hostname: "localhost",
            originalUrl: "/container/panel-1/status",
            method: "GET",
        };
        res = { header: jest.fn(), json: jest.fn() };
        next = jest.fn();
    });

    test("allows a public panel route without checking authentication", async () => {
        isPublicRoute.mockResolvedValue(true);

        await restrict.to(["admin"])(req, res, next);

        expect(isPublicRoute).toHaveBeenCalledWith("panel-1", "/status");
        expect(strategyGetEnabledCount).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.json).not.toHaveBeenCalled();
    });

    test("logs out and allows access when no authentication strategies are enabled", async () => {
        strategyGetEnabledCount.mockResolvedValue(0);

        await restrict.to(["admin"])(req, res, next);

        expect(req.logout).toHaveBeenCalledTimes(1);
        expect(req.isAuthenticated).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    test("continues when logout fails and no authentication strategies are enabled", async () => {
        strategyGetEnabledCount.mockResolvedValue(0);
        req.logout.mockImplementation((callback) => callback(new Error("logout failed")));

        await restrict.to(["admin"])(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.json).not.toHaveBeenCalled();
    });

    test("allows a valid panel key on routes that accept panel access", async () => {
        req.headers.authorization = "Bearer panel-key ";
        panelCheckKey.mockResolvedValue({ id: "panel-1", enabled: true });

        await restrict.to(["admin", "panel"])(req, res, next);

        expect(panelCheckKey).toHaveBeenCalledWith("panel-key");
        expect(req.isAuthenticated).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    test("rejects an invalid panel key for an unauthenticated request", async () => {
        req.headers.authorization = "Bearer invalid";

        await restrict.to(["panel"])(req, res, next);

        expect(panelCheckKey).toHaveBeenCalledWith("invalid");
        expect(next).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ status: "failure", message: expect.stringContaining("please log in") })
        );
    });

    test("does not grant panel-key access to routes without the panel role", async () => {
        req.headers.authorization = "Bearer panel-key";

        await restrict.to(["admin"])(req, res, next);

        expect(panelCheckKey).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: "failure" }));
    });

    test("allows an enabled user with a matching role", async () => {
        req.isAuthenticated.mockReturnValue(true);
        userGet.mockResolvedValue({ username: "tester", enabled: true, roles: ["user", "admin"] });

        await restrict.to(["admin"])(req, res, next);

        expect(userGet).toHaveBeenCalledWith("user-1");
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.json).not.toHaveBeenCalled();
    });

    test("rejects an enabled user without a matching role", async () => {
        req.isAuthenticated.mockReturnValue(true);
        userGet.mockResolvedValue({ username: "tester", enabled: true, roles: ["user"] });

        await restrict.to(["admin"])(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ status: "failure", message: expect.stringContaining("admin"), data: null })
        );
    });

    test.each([
        ["disabled", { username: "tester", enabled: false, roles: ["admin"] }],
        ["missing", null],
    ])("logs out and rejects a %s user", async (description, user) => {
        req.isAuthenticated.mockReturnValue(true);
        userGet.mockResolvedValue(user);

        await restrict.to(["admin"])(req, res, next);

        expect(req.logout).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ status: "failure", message: expect.stringContaining("please log in") })
        );
    });

    test("rejects an unauthenticated user", async () => {
        req.user = undefined;

        await restrict.to(["admin"])(req, res, next);

        expect(userGet).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ status: "failure", message: expect.stringContaining("please log in") })
        );
    });
});
