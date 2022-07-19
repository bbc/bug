"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBytes = require("@utils/format-bytes");
const sortHandlers = require("@core/sort-handlers");

const parseOs = (os) => {
    if (os.indexOf("Windows") > -1) {
        const split = os.split("|");
        return split[0].trim();
    }
    return os.trim();
};

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    let hosts = await mongoSingle.get("hosts");
    let vmMetrics = await mongoSingle.get("vmmetrics");

    let vms = await mongoSingle.get("vms");
    if (!vms) {
        vms = [];
    }

    if (filters["power_state"]) {
        vms = vms.filter((item) => {
            return item["power_state"] && item["power_state"] === filters["power_state"];
        });
    }

    if (filters["name_label"]) {
        vms = vms.filter((item) => {
            return (
                item["name_label"] && item["name_label"].toLowerCase().indexOf(filters.name_label.toLowerCase()) > -1
            );
        });
    }

    for (const eachVm of vms) {
        // add host details
        const host = hosts.find((host) => host.ref === eachVm.resident_on);
        eachVm["_residentHost"] = host ? host.name_label : "";

        // add metrics
        const vmMetric = vmMetrics.find((metric) => metric.ref === eachVm.guest_metrics);
        eachVm["_os"] = vmMetric?.os_version?.name ? parseOs(vmMetric?.os_version?.name) : "";
        eachVm["_ipv4"] = vmMetric?.networks?.["0/ipv4/0"] ? vmMetric?.networks?.["0/ipv4/0"] : "";

        // add agent flag
        eachVm["_hasAgent"] = vmMetric?.PV_drivers_version?.major ? true : false;

        // convert RAM to bytes
        eachVm["_memory"] = eachVm.memory_target > 0 ? formatBytes(eachVm.memory_target) : "";

        // and autopower flag
        eachVm["_autoPower"] = eachVm?.other_config?.auto_poweron === "true";
    }

    // these filters use a calculated field - do it here

    if (filters["_ipv4"]) {
        vms = vms.filter((item) => {
            return item["_ipv4"] && item["_ipv4"].indexOf(filters._ipv4) > -1;
        });
    }

    if (filters["_os"]) {
        vms = vms.filter((item) => {
            return item["_os"] && item["_os"].toLowerCase().indexOf(filters._os.toLowerCase()) > -1;
        });
    }

    const sortHandlerList = {
        name_label: sortHandlers.string,
        _residentHost: sortHandlers.string,
        _ipv4: sortHandlers.ipAddress,
        _os: sortHandlers.string,
        VCPUs_max: sortHandlers.number,
        memory_target: sortHandlers.number,
    };

    // sort
    if (sortField && sortHandlerList[sortField]) {
        if (sortDirection === "asc") {
            vms.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
        } else {
            vms.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
        }
    }

    return vms;
};
