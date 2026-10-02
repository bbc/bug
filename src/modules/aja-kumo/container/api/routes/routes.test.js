"use strict";

const express = require("express");
const request = require("supertest");

jest.mock("@core/logger", () => () => ({
    debug: jest.fn(),
    error: jest.fn(),
}));
jest.mock("@core/config-get", () => jest.fn().mockResolvedValue({}));
jest.mock("@services/router-get", () => jest.fn());
jest.mock("@services/router-route", () => jest.fn());
jest.mock("@services/capability-videorouter", () => jest.fn());

const routerGet = require("@services/router-get");
const routerRoute = require("@services/router-route");
const capabilityVideoRouter = require("@services/capability-videorouter");
const routerRouter = require("./router");
const routeRouter = require("./route");
const capabilitiesRouter = require("./capabilities");

const app = express();
app.use("/api/router", routerRouter);
app.use("/api/route", routeRouter);
app.use("/api/capabilities", capabilitiesRouter);
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ status: "error", message: error.message });
});

describe("AJA KUMO API routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /api/router returns cached router state in the standard response envelope", async () => {
        const state = { matrixSize: { sources: 16, destinations: 4 }, sources: [], destinations: [] };
        routerGet.mockResolvedValue(state);

        const response = await request(app).get("/api/router");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: { ...state, sourceGroups: [], destinationGroups: [] },
        });
        expect(routerGet).toHaveBeenCalledTimes(1);
    });

    test("GET /api/route/:destination/:source invokes the route service", async () => {
        routerRoute.mockResolvedValue(true);

        const response = await request(app).get("/api/route/3/7");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: "success", data: true });
        expect(routerRoute).toHaveBeenCalledWith("3", "7");
    });

    test("GET /api/capabilities/video-router returns normalized cached routes", async () => {
        const routes = [{ outputIndex: 3, outputLabel: "Monitor", inputIndex: 7, inputLabel: "Camera" }];
        capabilityVideoRouter.mockResolvedValue(routes);

        const response = await request(app).get("/api/capabilities/video-router");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: "success", data: routes });
    });

    test("returns an error response when a service rejects", async () => {
        routerGet.mockRejectedValueOnce(new Error("cache is empty"));

        const response = await request(app).get("/api/router");

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ status: "error", message: "cache is empty" });
    });
});
