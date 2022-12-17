const axios = require("axios");
const configGet = require("@core/config-get");

module.exports = async (deviceId, data = {}) => {
    const options = { timeout: 10000 };
    const config = await configGet();
    const device = config.devices[deviceId];
    let response;

    if (device) {
        //Check if the receiver needs a username and password
        if (device.username || device.password) {
            options.auth = {
                username: device?.username,
                password: device?.password,
            };
        }

        //Exterity boxes return LFCR invalid chars in responses so commands always throw expections. Handle them here
        //http://ip-address/cgi-bin/json_xfer?
        try {
            response = await axios.post(`http://${device.address}/cgi-bin/json_xfer`, data, options);
        } catch (err) {
            if (err.code === "HPE_INVALID_HEADER_TOKEN") {
                return true;
            } else {
                return false;
            }
        }

        if (response.status === 200) {
            return response.data;
        } else {
            return false;
        }
    }
};
