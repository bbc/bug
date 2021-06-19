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

        const decoderSids = link?.linksToDecoders.map((link) => {
            return link?.sid;
        });

        decoderSids.push(decoderSid);

        const response = await axios.put(
            `https://api-core.teradek.com/api/v1.0/${config?.organisation}/pairs/${link?.id}/decoders`,
            {
                params: {
                    auth_token: token?.auth_token,
                },
                decoderSids: decoderSids,
            }
        );

        if (response.data?.meta?.status === "ok") {
            return {
                status: "success",
                data: `Paired ${encoderSid} to ${decoderSid}.`,
            };
        } else {
            return {
                error: `Could not link ${encoderSid} to ${decoderSid}.`,
                status: "error",
                data: decoders,
            };
        }
    } catch (error) {
        return null;
    }
};
