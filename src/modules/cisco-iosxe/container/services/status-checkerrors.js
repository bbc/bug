"use strict";

const StatusItem = require("@core/StatusItem");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const interfacesCollection = await mongoCollection("interfaces");

    const errResult = await interfacesCollection.find({ "oper-status": "err-disable" }).toArray();
    if (errResult) {
        return errResult.map(
            (i) =>
                new StatusItem({
                    key: `intStatus${i.interfaceId}`,
                    message: `${i.interfaceId} is in an error-disabled state due to ${i?.["error-reason"]}`,
                    type: "warning",
                })
        );
    }
    return [];
};
