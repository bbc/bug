jest.mock("@core/logger", () => () => ({
    debug: jest.fn(),
    error: jest.fn(),
}));

jest.mock("@core/mikrotik-parseresults", () => jest.fn(({ result }) => result));

const task = require("./interface-lldp");

describe("workers/tasks/interface-lldp", () => {
    test("clears stale LLDP data and bulk updates current neighbors", async () => {
        const bulkWrite = jest.fn(async () => ({ modifiedCount: 3 }));
        const interfacesCollection = { bulkWrite };
        const routerOsApi = {
            run: jest.fn(async () => [
                {
                    interface: ["ether1", "ether2"],
                    id: "*1",
                    unpack: true,
                    "system-caps": ["bridge"],
                    "system-caps-enabled": ["bridge"],
                    identity: "switch-a",
                },
                {
                    interface: ["ether1"],
                    id: "*2",
                    unpack: true,
                    "system-caps": ["router"],
                    "system-caps-enabled": ["router"],
                    identity: "router-b",
                },
            ]),
        };

        await task({ routerOsApi, interfacesCollection });

        expect(routerOsApi.run).toHaveBeenCalledWith("/ip/neighbor/print");
        expect(bulkWrite).toHaveBeenCalledWith(
            [
                {
                    updateMany: {
                        filter: {
                            lldp: { $exists: true },
                            "default-name": { $nin: ["ether1", "ether2"] },
                        },
                        update: {
                            $unset: {
                                lldp: "",
                            },
                        },
                    },
                },
                {
                    updateOne: {
                        filter: { "default-name": "ether1" },
                        update: {
                            $set: {
                                lldp: [{ identity: "switch-a" }, { identity: "router-b" }],
                            },
                        },
                        upsert: false,
                    },
                },
                {
                    updateOne: {
                        filter: { "default-name": "ether2" },
                        update: {
                            $set: {
                                lldp: [{ identity: "switch-a" }],
                            },
                        },
                        upsert: false,
                    },
                },
            ],
            { ordered: false }
        );
    });

    test("still clears stale LLDP data when no neighbors are present", async () => {
        const bulkWrite = jest.fn(async () => ({ modifiedCount: 1 }));

        await task({
            routerOsApi: { run: jest.fn(async () => []) },
            interfacesCollection: { bulkWrite },
        });

        expect(bulkWrite).toHaveBeenCalledWith(
            [
                {
                    updateMany: {
                        filter: { lldp: { $exists: true } },
                        update: {
                            $unset: {
                                lldp: "",
                            },
                        },
                    },
                },
            ],
            { ordered: false }
        );
    });
});
