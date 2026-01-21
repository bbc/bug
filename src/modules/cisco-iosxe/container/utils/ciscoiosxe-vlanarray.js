"use strict";

module.exports = (allVlans, vlanArray) => {
    const selectedVlans = new Array(4094);
    for (const eachVlan of vlanArray) {
        if (eachVlan.toString().indexOf("-") > -1) {
            // it's a range
            const vlanRange = eachVlan.split("-");
            const start = parseInt(vlanRange[0]);
            const end = parseInt(vlanRange[1]);
            for (let i = start; i <= end; i++) {
                selectedVlans[i] = true;
            }
        } else {
            // it's a single vlan
            selectedVlans[parseInt(eachVlan)] = true;
        }
    }
    const vlanReturnArray = [];
    for (const eachVlan of allVlans) {
        if (selectedVlans[eachVlan.id]) {
            vlanReturnArray.push(eachVlan.id);
        }
    }
    return vlanReturnArray;
};
