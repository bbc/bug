"use strict";

exports.parse = function (xml) {
    // pass in this:
    // <channelStats>
    //    <channel id="rtp_udp_mux" name="BRIC Normal" rxAvgOverhead="7755" rxAvgPayload="95442" rxOverhead="7308" rxPayload="93004" rxTotal="14772" txAvgOverhead="7754" txAvgPayload="95440" txOverhead="7308" txPayload="93004" txTotal="14771"/>
    // </channelStats>

    if (xml?.children?.[0]?.name === "channelStats" && xml?.children?.[0]?.children.length === 1) {
        const channel = xml?.children?.[0]?.children[0];
        // copy the channel attributes
        return {
            ...channel.attributes,
            rxAvgOverhead: parseInt(channel?.attributes?.rxAvgOverhead),
            rxAvgPayload: parseInt(channel?.attributes?.rxAvgPayload),
            rxOverhead: parseInt(channel?.attributes?.rxOverhead),
            rxPayload: parseInt(channel?.attributes?.rxPayload),
            rxTotal: parseInt(channel?.attributes?.rxTotal),
            txAvgOverhead: parseInt(channel?.attributes?.txAvgOverhead),
            txAvgPayload: parseInt(channel?.attributes?.txAvgPayload),
            txOverhead: parseInt(channel?.attributes?.txOverhead),
            txPayload: parseInt(channel?.attributes?.txPayload),
            txTotal: parseInt(channel?.attributes?.txTotal),
        };
    }
    return false;
};
