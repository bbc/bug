jest.mock("@services/panel-get", () => jest.fn());
jest.mock("@core/logger", () => () => ({ debug: jest.fn(), error: jest.fn() }));

const panelGet = require("@services/panel-get");
const isPublicRoute = require("./panel-ispublicroute");

describe("panel-ispublicroute", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("matches configured public routes, including wildcard paths", async () => {
        panelGet.mockResolvedValue({ _module: { publicRoutes: ["/status", "/public/*"] } });

        await expect(isPublicRoute("panel-1", "/status")).resolves.toBe(true);
        await expect(isPublicRoute("panel-1", "/public/image")).resolves.toBe(true);
        await expect(isPublicRoute("panel-1", "/private")).resolves.toBe(false);
    });

    test("does not allow public access without a panel or configured routes", async () => {
        panelGet.mockResolvedValue({ _module: {} });

        await expect(isPublicRoute(undefined, "/status")).resolves.toBe(false);
        expect(panelGet).not.toHaveBeenCalled();
        await expect(isPublicRoute("panel-1", "/status")).resolves.toBe(false);
    });

    test("does not allow public access when panel lookup fails", async () => {
        panelGet.mockRejectedValue(new Error("lookup failed"));

        await expect(isPublicRoute("panel-1", "/status")).resolves.toBe(false);
    });
});
