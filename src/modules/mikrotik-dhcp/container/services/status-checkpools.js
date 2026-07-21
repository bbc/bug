
'use strict';

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

const ipv4ToInt = (address = "") => {
    const octets = address.split(".");
    if (octets.length !== 4) {
        return null;
    }

    const numbers = octets.map((octet) => Number.parseInt(octet, 10));
    if (numbers.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
        return null;
    }

    return (((numbers[0] * 256 + numbers[1]) * 256 + numbers[2]) * 256) + numbers[3];
};

const parsePoolRanges = (ranges = "") => {
    return ranges
        .split(",")
        .map((range) => range.trim())
        .filter(Boolean)
        .map((range) => {
            const [startAddress, endAddress = startAddress] = range.split("-").map((address) => address.trim());
            const start = ipv4ToInt(startAddress);
            const end = ipv4ToInt(endAddress);

            if (start === null || end === null) {
                return null;
            }

            return {
                start: Math.min(start, end),
                end: Math.max(start, end),
            };
        })
        .filter(Boolean);
};

const addressInRanges = (address, ranges) => {
    const numericAddress = ipv4ToInt(address);
    if (numericAddress === null) {
        return false;
    }

    return ranges.some((range) => numericAddress >= range.start && numericAddress <= range.end);
};

const leaseConsumesPoolAddress = (lease = {}) => {
    if (!lease.address || lease.disabled) {
        return false;
    }

    if (lease.dynamic === false) {
        return true;
    }

    return lease.status === "bound";
};

module.exports = async () => {

    try {
        const dbPools = await mongoCollection("pools");
        const dbLeases = await mongoCollection("leases");
        let pools = await dbPools.find().toArray();
        let leases = await dbLeases.find().toArray();
        if (!pools) {
            pools = [];
        }
        if (!leases) {
            leases = [];
        }

        const emptyPools = pools.filter((pool) => {
            const poolRanges = parsePoolRanges(pool.ranges);
            const occupiedAddressCount = new Set(
                leases
                    .filter((lease) => leaseConsumesPoolAddress(lease))
                    .map((lease) => lease.address)
                    .filter((address) => addressInRanges(address, poolRanges))
            ).size;
            const adjustedAvailable = Math.max((Number(pool.total) || 0) - occupiedAddressCount, 0);

            console.log(`Pool "${pool.name}" has ${occupiedAddressCount} occupied addresses and ${adjustedAvailable} available addresses.`);

            return adjustedAvailable === 0;
        });

        if (emptyPools.length > 0) {
            return emptyPools.map((pool) => {
                return new StatusItem({
                    message: `DHCP pool '${pool.name}' is full`,
                    key: `pool-${pool.id}`,
                    type: "warning"
                });
            });
        }
        return [];

    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};