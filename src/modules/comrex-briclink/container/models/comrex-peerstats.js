"use strict";

exports.parse = function (xml) {
    // pass in this:
    // <peerStats>
    //     <peer bufferDelay="184" bufferDelayAvg="194" bufferDesiredDelay="183" bufferMaxDelay="184" bufferMaxDev="183" bufferMinDelay="166" callTime="823" corrDownRate="0" corrDownRateAvg="0" corrUpRate="0" corrUpRateAvg="0" delayIn="370" delayOut="1430" effRxBitrate="100032" effTxBitrate="100032" frameLateRate="0" frameLateRateAvg="0" frameLossRate="0" frameLossRateAvg="0" id="1" insertRate="0" insertRateAvg="0" name="Loopback" newData="true" packetJitter="2" pktDupRate="0" pktDupRateAvg="0" pktOOORate="0" pktOOORateAvg="0" pktOutlierRate="0" pktOutlierRateAvg="0" pktRtxRate="0" pktRtxRateAvg="0" remoteLoss="0" remoteLossAvg="0" rtt="20" rxAvgOverhead="7754" rxAvgPayload="95434" rxOverhead="7301" rxPayload="92912" rxTotal="10369" txAvgOverhead="7754" txAvgPayload="95437" txOverhead="7301" txPayload="92912" txTotal="10376"/>
    // </peerStats>

    let results = {};
    if (xml?.children?.[0]?.name === "peerStats" && xml?.children?.[0]?.children.length === 1) {
        const peer = xml?.children?.[0]?.children[0];
        // copy the peer attributes
        results = {
            bufferDelay: parseInt(peer?.attributes?.bufferDelay),
            bufferDelayAvg: parseInt(peer?.attributes?.bufferDelayAvg),
            bufferDesiredDelay: parseInt(peer?.attributes?.bufferDesiredDelay),
            bufferMaxDelay: parseInt(peer?.attributes?.bufferMaxDelay),
            bufferMaxDev: parseInt(peer?.attributes?.bufferMaxDev),
            bufferMinDelay: parseInt(peer?.attributes?.bufferMinDelay),
            callTime: parseInt(peer?.attributes?.callTime),
            corrDownRate: parseInt(peer?.attributes?.corrDownRate),
            corrDownRateAvg: parseInt(peer?.attributes?.corrDownRateAvg),
            corrUpRate: parseInt(peer?.attributes?.corrUpRate),
            corrUpRateAvg: parseInt(peer?.attributes?.corrUpRateAvg),
            delayIn: parseInt(peer?.attributes?.delayIn),
            delayOut: parseInt(peer?.attributes?.delayOut),
            effRxBitrate: parseInt(peer?.attributes?.effRxBitrate),
            effTxBitrate: parseInt(peer?.attributes?.effTxBitrate),
            frameLateRate: parseInt(peer?.attributes?.frameLateRate),
            frameLateRateAvg: parseInt(peer?.attributes?.frameLateRateAvg),
            frameLossRate: parseInt(peer?.attributes?.frameLossRate),
            frameLossRateAvg: parseInt(peer?.attributes?.frameLossRateAvg),
            id: parseInt(peer?.attributes?.id),
            insertRate: parseInt(peer?.attributes?.insertRate),
            insertRateAvg: parseInt(peer?.attributes?.insertRateAvg),
            name: peer?.attributes?.name,
            newData: peer?.attributes?.newData === "true",
            packetJitter: parseInt(peer?.attributes?.packetJitter),
            pktDupRate: parseInt(peer?.attributes?.pktDupRate),
            pktDupRateAvg: parseInt(peer?.attributes?.pktDupRateAvg),
            pktOOORate: parseInt(peer?.attributes?.pktOOORate),
            pktOOORateAvg: parseInt(peer?.attributes?.pktOOORateAvg),
            pktOutlierRate: parseInt(peer?.attributes?.pktOutlierRate),
            pktOutlierRateAvg: parseInt(peer?.attributes?.pktOutlierRateAvg),
            pktRtxRate: parseInt(peer?.attributes?.pktRtxRate),
            pktRtxRateAvg: parseInt(peer?.attributes?.pktRtxRateAvg),
            remoteLoss: parseInt(peer?.attributes?.remoteLoss),
            remoteLossAvg: parseInt(peer?.attributes?.remoteLossAvg),
            rtt: parseInt(peer?.attributes?.rtt),
            rxAvgOverhead: parseInt(peer?.attributes?.rxAvgOverhead),
            rxAvgPayload: parseInt(peer?.attributes?.rxAvgPayload),
            rxOverhead: parseInt(peer?.attributes?.rxOverhead),
            rxPayload: parseInt(peer?.attributes?.rxPayload),
            rxTotal: parseInt(peer?.attributes?.rxTotal),
            txAvgOverhead: parseInt(peer?.attributes?.txAvgOverhead),
            txAvgPayload: parseInt(peer?.attributes?.txAvgPayload),
            txOverhead: parseInt(peer?.attributes?.txOverhead),
            txPayload: parseInt(peer?.attributes?.txPayload),
            txTotal: parseInt(peer?.attributes?.txTotal),
        };
        return results;
    }
    return false;
};
