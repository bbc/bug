jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const subworkerInterfaceLldp = require("./subworker-interfacelldp");

describe("subworker-interfacelldp", () => {
    test("rejects when subtree call fails", async () => {
        const mockSnmpAwait = {
            subtree: jest.fn(async () => {
                throw new Error("subtree failed");
            }),
        };
        const mockInterfacesCollection = { updateOne: jest.fn() };

        await expect(
            subworkerInterfaceLldp({ snmpAwait: mockSnmpAwait, interfacesCollection: mockInterfacesCollection }),
        ).rejects.toThrow("subtree failed");
    });

    test("processes lldp data", async () => {
        const mockSnmpAwait = {
            subtree: jest.fn(async () => ({
                "1.0.8802.1.1.2.1.4.1.1.9.0.1.0": Buffer.from("switch-a"),
            })),
        };
        const mockInterfacesCollection = { updateOne: jest.fn(async () => undefined) };

        await expect(
            subworkerInterfaceLldp({ snmpAwait: mockSnmpAwait, interfacesCollection: mockInterfacesCollection }),
        ).resolves.toBeUndefined();
    });
});
