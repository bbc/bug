const mockGet = jest.fn();
const mockSet = jest.fn();
const mockClose = jest.fn();

jest.mock("@core/snmp-await", () => {
    return jest.fn().mockImplementation(() => ({
        get: (...args) => mockGet(...args),
        set: (...args) => mockSet(...args),
        close: (...args) => mockClose(...args),
    }));
});
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn(), warning: jest.fn() }));

const validateSnmp = require("./validate-snmp");

describe("validate-snmp", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
        mockClose.mockReset();
    });

    test("returns failure when initial snmp read fails", async () => {
        mockGet.mockRejectedValue(new Error("snmp read failed"));
        const result = await validateSnmp({ address: "10.0.0.1", snmpCommunity: "public" });
        expect(result).toBeDefined();
        expect(mockClose).toHaveBeenCalled();
    });

    test("returns success when read and write checks pass", async () => {
        mockGet.mockResolvedValueOnce("desc").mockResolvedValueOnce("contact");
        mockSet.mockResolvedValue(true);

        const result = await validateSnmp({ address: "10.0.0.1", snmpCommunity: "public" });
        expect(result).toBeDefined();
        expect(mockClose).toHaveBeenCalled();
    });
});
