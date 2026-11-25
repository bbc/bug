const request = require("supertest");
const { Readable } = require("stream");

jest.mock("@middleware/restrict", () => ({
    to: () => (_req, _res, next) => next(),
}));

jest.mock("@models/panel-config", () => ({
    get: jest.fn(),
}));

jest.mock("axios", () => jest.fn());

const axios = require("axios");
const panelConfig = require("@models/panel-config");
const system = require("@bin/api");

describe("Test the '/container/' endpoint", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        panelConfig.get.mockResolvedValue({ id: "test-panel", module: "clock" });
    });

    test("Test the '/:panelid/*' proxy route", async () => {
        axios.mockResolvedValue({
            status: 200,
            headers: { "content-type": "text/plain" },
            data: Readable.from(["ok"]),
        });

        const response = await request(system).get("/container/test-panel/status");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("ok");
        expect(response.headers["content-type"]).toContain("text/plain");
    });

    test("forwards the method, path, query and request body to the panel", async () => {
        axios.mockResolvedValue({
            status: 201,
            headers: { "content-type": "text/plain" },
            data: Readable.from(["updated"]),
        });

        const response = await request(system).post("/container/test-panel/settings?mode=live").send({ enabled: true });

        expect(panelConfig.get).toHaveBeenCalledWith("test-panel");
        expect(axios).toHaveBeenCalledWith(
            expect.objectContaining({
                method: "POST",
                url: `http://test-panel:${process.env.MODULE_PORT || 3200}/api/settings?mode=live`,
                responseType: "stream",
                data: { enabled: true },
                headers: expect.objectContaining({
                    "Content-Type": "application/json",
                    "X-Forwarded-For": expect.any(String),
                }),
            })
        );
        expect(response.statusCode).toBe(201);
        expect(response.text).toBe("updated");
    });

    test("forwards an upstream error status, content type and body stream", async () => {
        const error = new Error("upstream returned an error");
        error.response = {
            status: 404,
            headers: { "content-type": "text/plain" },
            data: Readable.from(["not found"]),
        };
        axios.mockRejectedValue(error);

        const response = await request(system).get("/container/test-panel/missing");

        expect(response.statusCode).toBe(404);
        expect(response.headers["content-type"]).toContain("text/plain");
        expect(response.text).toBe("not found");
    });

    test("returns an error message when the upstream error has no stream", async () => {
        const error = new Error("upstream unavailable");
        error.response = { status: 502 };
        axios.mockRejectedValue(error);

        const response = await request(system).get("/container/test-panel/status");

        expect(response.statusCode).toBe(502);
        expect(response.body).toEqual({ status: "error", message: "upstream unavailable" });
    });
});
