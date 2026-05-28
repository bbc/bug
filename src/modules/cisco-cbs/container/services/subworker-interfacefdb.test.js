const mockMongoSingleGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoSingleGet(...args) }));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const subworkerInterfaceFdb = require("./subworker-interfacefdb");

describe("subworker-interfacefdb", () => {
    beforeEach(() => {
        mockMongoSingleGet.mockReset();
    });

    test("rejects when subtree call fails", async () => {
        const mockSnmpAwait = {
            subtree: jest.fn(async () => {
                throw new Error("subtree failed");
            }),
            oidToMac: jest.fn(),
        };
        const mockInterfacesCollection = { updateOne: jest.fn() };

        await expect(
            subworkerInterfaceFdb({ snmpAwait: mockSnmpAwait, interfacesCollection: mockInterfacesCollection }),
        ).rejects.toThrow("subtree failed");
    });

    test("processes subtree results", async () => {
        mockMongoSingleGet.mockResolvedValue([]);
        const mockSnmpAwait = {
            subtree: jest.fn(async () => ({ "1.3.6.1.2.1.17.4.3.1.2.0.1.2.3.4.5": 3 })),
            oidToMac: jest.fn(() => "00:01:02:03:04:05"),
        };
        const mockInterfacesCollection = { updateOne: jest.fn(async () => undefined) };

        await expect(
            subworkerInterfaceFdb({ snmpAwait: mockSnmpAwait, interfacesCollection: mockInterfacesCollection }),
        ).resolves.toBeUndefined();
    });
});
