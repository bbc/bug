const delivery = require("@services/panelconfig-delivery");
const panelFilter = require("./panel");

test("shows pending configuration delivery without changing module status", () => {
    const config = { id: "panel-1", module: "test", enabled: true };
    const module = { needsContainer: true };
    const status = { statusItems: [{ key: "healthy", type: "default", message: ["OK"] }] };
    delivery.clear(config.id);

    const panel = panelFilter(config, module, { state: "running" }, null, status, null, []);

    expect(panel._configDelivery).toBe("pending");
    expect(panel._status).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ key: "healthy" }),
            expect.objectContaining({ key: "config-delivery-pending" }),
        ])
    );
    expect(status.statusItems).toHaveLength(1);

    delivery.accept(config, { Id: "container", State: { StartedAt: "now" } });
    const updated = panelFilter(config, { needsContainer: true }, { state: "running" }, null, status, null, []);
    expect(updated._configDelivery).toBe("accepted");
    expect(updated._status).toEqual([expect.objectContaining({ key: "healthy" })]);
    delivery.clear(config.id);
});
