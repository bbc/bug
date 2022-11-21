const axios = require("axios");
const configGet = require("@core/config-get");

module.exports = async (deviceId, command) => {
    const options = { timeout: 10000 };
    const config = await configGet();
    const device = config.devices[deviceId];

    if (device) {
        //Check if the receiver needs a username and password
        if (device.username || device.password) {
            options.auth = {
                username: device?.username,
                password: device?.password,
            };
        }

        const response = await axios.get(`http://${device.address}/${command}`, options);
        if (response.status === 200) {
            return response.data;
        } else {
            return false;
        }
    }
};
