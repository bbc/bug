"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const netgearApi = require("@utils/netgear-api");

module.exports = async (port, newName) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const NetgearApi = new netgearApi({
        host: config.address,
        username: config.username,
        password: config.password,
    });

    console.log(`interface-enable: disabling interface ${port}`);

    // fetch existing config
    const portConfig = await NetgearApi.get({ path: `swcfg_port?portid=${port}` });

    // replace value
    portConfig.switchPortConfig.adminMode = true;
    delete portConfig.resp;

    // save it back
    const result = await NetgearApi.post({ path: `swcfg_port?portid=${port}`, params: portConfig });

    if (result?.resp?.status === "success") {
        console.log(`interface-enable: success - updating DB`);
        // update db
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            const dbResult = await interfacesCollection.updateOne(
                { port: parseInt(port) },
                { $set: { adminMode: true } }
            );
            console.log(`interface-enable: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-enable: failed to update db`);
            console.log(error);
            return false;
        }
    }
    return false;
};
