"use strict";

module.exports = (allVlans, vlanArray) => {
    const individualVlans = new Array(4094);

    if (vlanArray.length === 4094) {
        return ["1-4094"];
    }

    for (const eachVlan of vlanArray) {
        if (eachVlan === "1-4094") {
            // look - let's just return all the vlans - it's easier
            return ["1-4094"];
        }
    }

    for (const eachVlan of vlanArray) {
        if (eachVlan.toString().indexOf("-") > -1) {
            // it's a range
            const vlanRange = eachVlan.split("-");
            const start = parseInt(vlanRange[0]);
            const end = parseInt(vlanRange[1]);
            for (let i = start; i <= end; i++) {
                individualVlans[i] = true;
            }
        } else {
            // it's a single vlan
            individualVlans[parseInt(eachVlan)] = true;
        }
    }

    let previousValue = false;
    let start = null;
    const vlanRanges = [];

    for (const eachVlan of allVlans) {
        const eachVlanInt = parseInt(eachVlan.id);

        if (individualVlans[eachVlan.id] && !previousValue) {
            start = parseInt(eachVlan.id);
        }
        if (!individualVlans[eachVlan.id] && start !== null) {
            // we've reached the end of the run
            if (start === eachVlanInt - 1) {
                // it's just one value
                vlanRanges.push(start.toString());
            } else {
                // it's a range
                vlanRanges.push(`${start}-${eachVlanInt - 1}`);
            }

            start = null;
        }

        previousValue = individualVlans[eachVlan.id];
    }

    const lastVlan = parseInt(allVlans[allVlans.length - 1].id);
    if (start !== null) {
        if (start === lastVlan) {
            // it's just one value
            vlanRanges.push(start.toString());
        } else {
            // it's a range
            vlanRanges.push(`${start}-${lastVlan}`);
        }
    }

    return vlanRanges;
};
