"use strict";

module.exports = async (mikrotik, targetAddress) => {
    const data = await mikrotik.write(`/tool/traceroute`, [`=address=${targetAddress}`, `=duration=1`, `=count=3`]);
    data.pop(data.length - 1);
    return data;
};
