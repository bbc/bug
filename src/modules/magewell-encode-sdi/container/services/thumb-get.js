"use strict";

const configGet = require("@core/config-get");
const magewellEncodeSdi = require("@utils/magewell-encode-sdi");
const axios = require("axios");

module.exports = async () => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    const magewellClient = magewellEncodeSdi.createClient({
        address: config.address,
        username: config.username,
        password: config.password,
        apiPath: "/usapi",
        codeField: "result",
    });

    await magewellClient.login();

    const response = await axios.get(`http://${config.address}/tmp/sbox-snapshot/sbox-quarter.jpg`, {
        responseType: "arraybuffer",
        headers: {
            ...(magewellClient.cookie ? { Cookie: magewellClient.cookie } : {}),
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
        },
    });

    return Buffer.from(response.data);
};
