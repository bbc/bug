"use strict";

const comrexSocket = require("@utils/comrex-socket");
const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");

module.exports = async (profileId, profileName) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    try {
        const device = new comrexSocket({
            host: config.address,
            port: config.port,
            username: config.username,
            password: config.password,
        });
        await device.connect();
        let cmd = `<setProfile id="${profileId}">`;
        cmd += `<settings name="${profileName}"/>`;
        cmd += `</setProfile>`;
        console.log(`profile-rename: sending '${cmd}'`);
        device.send(cmd);
        setTimeout(() => {
            device.disconnect();
        }, 1000);

        // now we can assume it's worked, we should update the db
        const profileList = await mongoSingle.get("profileList");
        const foundProfile = profileList.find((profile) => profile.id === parseInt(profileId));
        foundProfile.settings.name = profileName;
        await mongoSingle.set("profileList", profileList, 60);
        return true;
    } catch (error) {
        return false;
    }
};
