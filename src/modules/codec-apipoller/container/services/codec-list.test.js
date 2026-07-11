const mockMongoSingleGet = jest.fn();
const mockLoggerError = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
}));

jest.mock("@core/logger", () => () => ({
    error: (...args) => mockLoggerError(...args),
}));

jest.mock("@core/sort-handlers", () => ({
    string: (a, b, field) => String(a?.[field] || "").localeCompare(String(b?.[field] || ""), "en", { sensitivity: "base" }),
    ipAddress: (a, b, field) => String(a?.[field] || "").localeCompare(String(b?.[field] || ""), "en", { numeric: true, sensitivity: "base" }),
    number: (a, b, field) => Number(a?.[field] || 0) - Number(b?.[field] || 0),
}));

const service = require("./codec-list");

describe("codec-list", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns empty array when no codec data exists", async () => {
        mockMongoSingleGet.mockResolvedValue(null);

        const result = await service();

        expect(result).toEqual([]);
    });

    test("filters and sorts codec records", async () => {
        mockMongoSingleGet.mockResolvedValue([
            {
                id: "2",
                name: "Zulu Decoder",
                zone: "bcn",
                capabilities: ["aac", "udp"],
                address: "172.26.98.12",
                port: 6020,
                device: {
                    name: "Decoder B",
                    location: "Barcelona",
                    tags: ["decoder"],
                    description: "Backup",
                    model: "7880",
                    manufacturer: "Evertz",
                    notes: "Spare",
                },
            },
            {
                id: "1",
                name: "Alpha Decoder",
                zone: "bcn",
                capabilities: ["aac", "rtp"],
                address: "172.26.98.11",
                port: 6010,
                device: {
                    name: "Decoder A",
                    location: "Barcelona",
                    tags: ["decoder", "dr"],
                    description: "Primary",
                    model: "7880",
                    manufacturer: "Evertz",
                    notes: "Main",
                },
            },
        ]);

        const result = await service("name", "asc", {
            zone: ["bcn"],
            capabilities: ["aac"],
            "device.tags": ["decoder"],
            "device.location": "barcelona",
        });

        expect(result.map((item) => item.name)).toEqual(["Alpha Decoder", "Zulu Decoder"]);
    });

    test("logs and rethrows lookup failures", async () => {
        mockMongoSingleGet.mockRejectedValue(new Error("boom"));

        await expect(service()).rejects.toThrow("boom");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });
});
