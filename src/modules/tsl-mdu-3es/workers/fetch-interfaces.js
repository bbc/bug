const delay = require('delay');
const lokiDb = require('../utils/db');
const bitrate = require('bitrate');
var db = null;
var dbInterfaces = null;

const delayMs = 2000;
const conn = new RosApi({
    host: "172.26.108.126",
    user: "bug",
    password: "sfsafawffasfasr33r",
    timeout: 5
});

const main = async () => {
    db = await lokiDb;

    dbInterfaces = db.getCollection("interfaces");

    try {
        await conn.connect();
    } catch (error) {
        console.log("error connecting to device");
    }

    var noErrors = true;
    while (noErrors) {
        try {
            const interfaces = await getInterfaces();
            await saveInterfaces(interfaces);
        } catch (error) {
            noErrors = true;
        }
        await delay(delayMs);
        console.log("loop");
    }
    await conn.close();
}

main();