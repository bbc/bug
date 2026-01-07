const formatBps = (bits, decimals) => {
    if (bits === 0) return "0";
    if (bits < 0) {
        bits = bits * -1;
    }
    if (decimals === undefined) {
        decimals = 2;
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["b/s", "kb/s", "Mb/s", "Gb/s", "Tb/s", "Pb/s"];

    const i = Math.floor(Math.log(bits) / Math.log(k));
    const size = sizes[i] ? sizes[i] : sizes[0];
    return parseFloat((bits / Math.pow(k, i)).toFixed(dm)) + " " + size;
};

export default formatBps;