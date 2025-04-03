"use strict";

module.exports = async (NetgearApi, interfacesCollection) => {

    const result = await NetgearApi.get({ path: "swcfg_port?portid=ALL" });

    // save to db
    const interfaces = result?.switchPortConfig;
    if (interfaces) {
        for (let eachInterface of interfaces) {

            const filteredFields = {};
            filteredFields.interfaceId = `Ethernet${eachInterface.ID}`;
            filteredFields.longId = `Ethernet${eachInterface.ID}`;
            filteredFields.shortId = `eth${eachInterface.ID}`;
            filteredFields.description = eachInterface.description;
            filteredFields.port = eachInterface.ID;
            filteredFields.isPoE = eachInterface.isPoE;
            filteredFields.linkStatus = eachInterface.linkStatus;
            filteredFields.linkStatus = eachInterface.linkStatus;

            // add the timestamp
            const dbDocument = { ...filteredFields, timestamp: new Date() };

            // and save it to the db
            await interfacesCollection.updateOne(
                { interfaceId: dbDocument.interfaceId },
                { $set: dbDocument },
                { upsert: true }
            );
        };
    }
};

