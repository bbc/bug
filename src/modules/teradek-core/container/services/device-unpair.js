"use strict";

const mongoCollection = require("@core/mongo-collection");
const axios = require("axios");
const configGet = require("@core/config-get");
const deviceUpdateLocal = require("./device-updatelocal");

module.exports = async (encoderSid, decoderSid) => {
    try {
        const tokenCollection = await mongoCollection("token");
        const linksCollection = await mongoCollection("links");
        const token = await tokenCollection.findOne();
        const link = await linksCollection.findOne({ encoderSid: encoderSid });
        const config = await configGet();

        const response = await axios.delete(
            `https://api-core.teradek.com/api/v1.0/${config?.organisation}/pairs/${link?.id}/decoders?auth_token=${token?.auth_token}`,
            {
                data: {
                    decoderSids: [`${decoderSid}`],
                },
            }
        );

        console.log(response);
        if (response.data?.meta?.status === "ok") {
            console.log(`Unpaired ${encoderSid} from ${decoderSid}.`);
            return await deviceUpdateLocal(decoderSid, "link", null);
        } else {
            console.log(`Could not unpair ${encoderSid} from ${decoderSid}.`);
            console.log(response.data);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};
