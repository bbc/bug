const calculateTraffic = require("./calculate-traffic");

describe("calculate-traffic", () => {
    test("calculates per-second rates from interface counters", () => {
        const previousInterface = {
            name: "ether1",
            timestamp: new Date("2026-01-01T00:00:00.000Z"),
            "rx-byte": 100,
            "tx-byte": 200,
            "rx-packet": 10,
            "tx-packet": 15,
            "fp-rx-byte": 400,
            "fp-tx-byte": 500,
            "fp-rx-packet": 20,
            "fp-tx-packet": 25,
            "rx-drop": 1,
            "tx-drop": 2,
            "tx-queue-drop": 3,
            "rx-error": 4,
            "tx-error": 5,
        };

        const currentInterface = {
            name: "ether1",
            timestamp: new Date("2026-01-01T00:00:02.000Z"),
            "rx-byte": 300,
            "tx-byte": 260,
            "rx-packet": 26,
            "tx-packet": 23,
            "fp-rx-byte": 600,
            "fp-tx-byte": 540,
            "fp-rx-packet": 30,
            "fp-tx-packet": 29,
            "rx-drop": 5,
            "tx-drop": 6,
            "tx-queue-drop": 11,
            "rx-error": 8,
            "tx-error": 9,
        };

        const result = calculateTraffic(currentInterface, previousInterface);

        expect(result.name).toBe("ether1");
        expect(result["rx-bits-per-second"]).toBe(800);
        expect(result["tx-bits-per-second"]).toBe(240);
        expect(result["rx-packets-per-second"]).toBe(8);
        expect(result["tx-packets-per-second"]).toBe(4);
        expect(result["fp-rx-bits-per-second"]).toBe(800);
        expect(result["fp-tx-bits-per-second"]).toBe(160);
        expect(result["fp-rx-packets-per-second"]).toBe(5);
        expect(result["fp-tx-packets-per-second"]).toBe(2);
        expect(result["tx-queue-drops-per-second"]).toBe(4);
        expect(result["rx-errors-per-second"]).toBe(2);
        expect(result["tx-errors-per-second"]).toBe(2);
        expect(result["tx-bits-per-second-text"]).toBe("240 b/s");
        expect(result["rx-bits-per-second-text"]).toBe("800 b/s");
    });

    test("returns zero rates when counters reset or timestamp is not increasing", () => {
        const previousInterface = {
            name: "ether2",
            timestamp: new Date("2026-01-01T00:00:10.000Z"),
            "rx-byte": 500,
            "tx-byte": 500,
            "rx-packet": 50,
            "tx-packet": 50,
            "fp-rx-byte": 500,
            "fp-tx-byte": 500,
            "fp-rx-packet": 50,
            "fp-tx-packet": 50,
            "rx-drop": 10,
            "tx-drop": 10,
            "tx-queue-drop": 10,
            "rx-error": 10,
            "tx-error": 10,
        };

        const currentInterface = {
            name: "ether2",
            timestamp: new Date("2026-01-01T00:00:10.000Z"),
            "rx-byte": 100,
            "tx-byte": 100,
            "rx-packet": 10,
            "tx-packet": 10,
            "fp-rx-byte": 100,
            "fp-tx-byte": 100,
            "fp-rx-packet": 10,
            "fp-tx-packet": 10,
            "rx-drop": 1,
            "tx-drop": 1,
            "tx-queue-drop": 1,
            "rx-error": 1,
            "tx-error": 1,
        };

        const result = calculateTraffic(currentInterface, previousInterface);

        expect(result["rx-bits-per-second"]).toBe(0);
        expect(result["tx-bits-per-second"]).toBe(0);
        expect(result["rx-packets-per-second"]).toBe(0);
        expect(result["tx-packets-per-second"]).toBe(0);
        expect(result["tx-queue-drops-per-second"]).toBe(0);
        expect(result["rx-errors-per-second"]).toBe(0);
        expect(result["tx-errors-per-second"]).toBe(0);
    });
});
