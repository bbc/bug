"use strict";

exports.parse = function (xml) {
    // pass in one of these:
    // <sysOptions always_on_peer="2" cc_1_peer="0" cc_2_peer="0" cc_3_peer="0" cc_4_peer="0" connect_password="" connect_status_cc="false" meter_demo="false" modem_squelch="false" nothrot="false" unit_name="NG Ops BLII 1383"><auxserial baud="9600" data="8" flow="NONE" parity="NONE" stop="1"/><remote_access remote_gui="true" remote_gui_password="" remote_ssh="true" remote_web_port="80"/></sysOptions>

    if (xml?.children?.[0]?.name === "sysOptions") {
        const sysOptions = xml?.children?.[0]?.attributes;
        // copy the attributes
        return {
            ...sysOptions,
            always_on_peer: parseInt(sysOptions?.always_on_peer),
            cc_1_peer: parseInt(sysOptions?.cc_1_peer),
            cc_2_peer: parseInt(sysOptions?.cc_2_peer),
            cc_3_peer: parseInt(sysOptions?.cc_3_peer),
            cc_4_peer: parseInt(sysOptions?.cc_4_peer),
            connect_status_cc: sysOptions?.connect_status_cc === "true",
            meter_demo: sysOptions?.meter_demo === "true",
            modem_squelch: sysOptions?.modem_squelch === "true",
            nothrot: sysOptions?.nothrot === "true",
        };
    }
    return false;
};
