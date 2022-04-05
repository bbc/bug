"use strict";

exports.parse = function (xml) {
    // pass in this:
    // <peerStats>
    //     <peer bufferDelay="184" bufferDelayAvg="194" bufferDesiredDelay="183" bufferMaxDelay="184" bufferMaxDev="183" bufferMinDelay="166" callTime="823" corrDownRate="0" corrDownRateAvg="0" corrUpRate="0" corrUpRateAvg="0" delayIn="370" delayOut="1430" effRxBitrate="100032" effTxBitrate="100032" frameLateRate="0" frameLateRateAvg="0" frameLossRate="0" frameLossRateAvg="0" id="1" insertRate="0" insertRateAvg="0" name="Loopback" newData="true" packetJitter="2" pktDupRate="0" pktDupRateAvg="0" pktOOORate="0" pktOOORateAvg="0" pktOutlierRate="0" pktOutlierRateAvg="0" pktRtxRate="0" pktRtxRateAvg="0" remoteLoss="0" remoteLossAvg="0" rtt="20" rxAvgOverhead="7754" rxAvgPayload="95434" rxOverhead="7301" rxPayload="92912" rxTotal="10369" txAvgOverhead="7754" txAvgPayload="95437" txOverhead="7301" txPayload="92912" txTotal="10376"/>
    // </peerStats>

    const results = [];
    if (xml?.children?.[0]?.name === "peerStats") {
        for (const peer of xml?.children?.[0]?.children) {
            // copy the peer attributes
            results.push({ ...peer.attributes });
        }
        return results;
    }
    return false;
};
