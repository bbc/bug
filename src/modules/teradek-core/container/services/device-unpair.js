"use strict";

const mongoCollection = require("@core/mongo-collection");
const axios = require("axios");
const configGet = require("@core/config-get");

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
            return {
                status: "success",
                data: `Unpaired ${encoderSid} from ${decoderSid}.`,
            };
        } else {
            return {
                error: `Could not unpair ${encoderSid} from ${decoderSid}.`,
                status: "error",
                data: decoders,
            };
        }
    } catch (error) {
        return null;
    }
};
