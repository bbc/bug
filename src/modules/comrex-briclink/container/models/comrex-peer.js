"use strict";

exports.parseList = function (xml) {
    // pass in a load of these:
    //    <peerList>
    //      <peer active="false" addr="127.0.0.1" autoconn="false" backup="false" backup_id="0" can_connect="normal" chan_state="" id="1" incoming="false" name="Loopback" password="" profile="0" retry_primary="false" standby="false" stored="true" unit="" use_xlock="true" xlock="false" />
    //      <peer active="false" addr="70.22.155.131:9000" autoconn="false" backup="false" backup_id="0" can_connect="normal" chan_state="" id="2" incoming="false" name="Comrex Lab Voice" password="" profile="0" retry_primary="false" standby="false" stored="true" unit="" use_xlock="true" xlock="false" />
    //    </peerList>

    const results = [];
    if (xml?.children?.[0]?.name === "peerList") {
        // console.log("peer");
        for (const peer of xml?.children?.[0]?.children) {
            // copy the peer attributes
            results.push({ ...peer.attributes });
        }
        // console.log(results);
        return results;
    }
    return false;
};
