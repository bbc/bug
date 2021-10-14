"use strict";

const mongoCollection = require("@core/mongo-collection");
const axios = require("axios");
const configGet = require("@core/config-get");
const deviceUpdateLocal = require("./device-updatelocal");

module.exports = async (encoderSid, decoderSid) => {
    const devicesCollection = await mongoCollection("devices");
    const tokenCollection = await mongoCollection("token");
    const linksCollection = await mongoCollection("links");
    const token = await tokenCollection.findOne();
    const config = await configGet();

    // so ... first of all we need to check if the decoder is already paired, and if so, remove it.
    const decoder = await devicesCollection.findOne({ sid: decoderSid });
    if (!decoder) {
        console.log(`failed to find decoder ${decoderSid}`);
        throw new Error();
    }
    if (decoder?.link?.encoderSid) {
        // we need to unlink it first ...
        const oldLink = await linksCollection.findOne({ encoderSid: decoder?.link?.encoderSid });
        const response = await axios.delete(
            `https://api-core.teradek.com/api/v1.0/${config?.organisation}/pairs/${oldLink?.id}/decoders?auth_token=${token?.auth_token}`,
            {
                data: {
                    decoderSids: [`${decoderSid}`],
                },
            }
        );
        if (response.data?.meta?.status === "ok") {
            console.log(`Unpaired ${encoderSid} from ${decoderSid}.`);
        } else {
            console.log(`failed to unpair ${encoderSid} from ${decoderSid}.`);
            throw new Error();
        }
    }

    // now we can link up the new one
    const newLink = await linksCollection.findOne({ encoderSid: encoderSid });

    // get the existing device ids from the links collection
    const decoderSids = newLink?.linksToDecoders.map((link) => {
        return link?.sid;
    });

    // and add the new one to it
    decoderSids.push(decoderSid);

    const response = await axios.put(
        `https://api-core.teradek.com/api/v1.0/${config?.organisation}/pairs/${newLink?.id}/decoders?auth_token=${token?.auth_token}`,
        {
            decoderSids: decoderSids,
        }
    );

    if (response.data?.meta?.status === "ok") {
        console.log(`Paired ${encoderSid} to ${decoderSid}.`);
        return await deviceUpdateLocal(decoderSid, "link", { encoderSid: encoderSid });
    } else {
        console.log(response.data);
        throw new Error();
    }
};
