jest.mock("@services/panelconfig-get", () => jest.fn());
jest.mock("@core/logger", () => () => ({ debug: jest.fn() }));

const { EventEmitter } = require("events");

describe("panel config socket", () => {
    let getPanelConfig;
    let adapter;
    let socket;
    let roomEmit;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.isolateModules(() => {
            getPanelConfig = require("@services/panelconfig-get");
            const panelConfigSocket = require("./panel-config");
            adapter = new EventEmitter();
            socket = new EventEmitter();
            socket.id = "socket-1";
            socket.join = jest.fn();
            socket.leave = jest.fn();
            jest.spyOn(socket, "emit");
            roomEmit = jest.fn();
            panelConfigSocket({ adapter, to: jest.fn(() => ({ emit: roomEmit })) }, socket);
        });
        getPanelConfig.mockReset();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test("subscribes, sends the current configuration and leaves on unsubscribe", async () => {
        getPanelConfig.mockResolvedValue({ id: "panel-1", title: "Clock" });

        await socket.listeners("subscribe")[0]("panel-1");

        expect(socket.join).toHaveBeenCalledWith("panelId:panel-1");
        expect(socket.emit).toHaveBeenCalledWith("event", {
            status: "success",
            data: { id: "panel-1", title: "Clock" },
        });

        await socket.listeners("unsubscribe")[0]("panel-1");
        expect(socket.leave).toHaveBeenCalledWith("panelId:panel-1");
    });

    test("sends an error if the initial configuration lookup fails", async () => {
        getPanelConfig.mockRejectedValue(new Error("lookup failed"));

        await socket.listeners("subscribe")[0]("panel-1");

        expect(socket.emit).toHaveBeenCalledWith("event", {
            status: "error",
            message: "Failed to get panel-1 config",
        });
    });

    test("broadcasts changed configurations and stops polling when the room is deleted", async () => {
        getPanelConfig
            .mockResolvedValueOnce({ title: "First" })
            .mockResolvedValueOnce({ title: "First" })
            .mockResolvedValueOnce({ title: "Second" });

        adapter.emit("create-room", "panelId:panel-1");
        await jest.advanceTimersByTimeAsync(0);
        expect(roomEmit).toHaveBeenCalledTimes(1);
        expect(roomEmit).toHaveBeenLastCalledWith("event", { status: "success", data: { title: "First" } });

        await jest.advanceTimersByTimeAsync(1000);
        expect(roomEmit).toHaveBeenCalledTimes(1);
        await jest.advanceTimersByTimeAsync(1000);
        expect(roomEmit).toHaveBeenCalledTimes(2);
        expect(roomEmit).toHaveBeenLastCalledWith("event", { status: "success", data: { title: "Second" } });

        adapter.emit("delete-room", "panelId:panel-1");
        await jest.advanceTimersByTimeAsync(3000);
        expect(getPanelConfig).toHaveBeenCalledTimes(3);
    });

    test("does not schedule another poll when the room is deleted during a lookup", async () => {
        let finishLookup;
        getPanelConfig.mockReturnValue(new Promise((resolve) => (finishLookup = resolve)));

        adapter.emit("create-room", "panelId:panel-1");
        adapter.emit("delete-room", "panelId:panel-1");
        finishLookup({ title: "Clock" });
        await jest.advanceTimersByTimeAsync(3000);

        expect(getPanelConfig).toHaveBeenCalledTimes(1);
        expect(jest.getTimerCount()).toBe(0);
    });

    test("leaves the subscribed room on disconnect", async () => {
        getPanelConfig.mockResolvedValue({ id: "panel-1" });
        await socket.listeners("subscribe")[0]("panel-1");

        socket.emit("disconnect");

        expect(socket.leave).toHaveBeenCalledWith("panelId:panel-1");
    });
});
