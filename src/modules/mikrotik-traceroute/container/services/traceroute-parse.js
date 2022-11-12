"use strict";

module.exports = async (ipInfo, traceroute) => {
    let results = [];
    for (let index in traceroute) {
        const result = await ipInfo.lookupIp(traceroute[index].address);
        if (result) {
            if (result.loc && !Array.isArray(result.loc)) {
                result.loc = result.loc.split(",");

                for (let i in result.loc) {
                    result.loc[i] = parseFloat(result.loc[i]);
                }
            }
            results[index] = { ...traceroute[index], ...result };
        }
    }
    return results;
};
