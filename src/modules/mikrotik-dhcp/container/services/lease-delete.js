"use strict";

const leaseDelete = require("./mikrotik-leasedelete");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (leaseId) => {

    // delete from device
    if (!await leaseDelete(leaseId)) {
        console.log(`lease-delete: deleted lease ${leaseId} from device`);
        return false;
    }

    // now delete from db
    const dbLeases = await mongoCollection("leases");
    try {
        await dbLeases.deleteOne({ "id": leaseId });
        console.log(`lease-delete: deleted lease ${leaseId} from db`);
    } catch (error) {
        return false;
    }
    return true;
};
