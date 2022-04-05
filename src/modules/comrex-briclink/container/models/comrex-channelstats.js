"use strict";

exports.parse = function (xml) {
    // pass in this:
    // <channelStats>
    //    <channel id="rtp_udp_mux" name="BRIC Normal" rxAvgOverhead="7755" rxAvgPayload="95442" rxOverhead="7308" rxPayload="93004" rxTotal="14772" txAvgOverhead="7754" txAvgPayload="95440" txOverhead="7308" txPayload="93004" txTotal="14771"/>
    // </channelStats>

    const results = [];
    if (xml?.children?.[0]?.name === "channelStats") {
        for (const channel of xml?.children?.[0]?.children) {
            // copy the channel attributes
            results.push({ ...channel.attributes });
        }
        return results;
    }
    return false;
};
