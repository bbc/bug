module.exports = (bits, decimals) => {
    if (bits === 0) return "0";
    if (bits < 0) {
        bits = bits * -1;
    }
    if (decimals === undefined) {
        decimals = 2;
    }
    const sizes = ["b", "K", "M", "G", "T", "P"];
    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;

    const i = Math.floor(Math.log(bits) / Math.log(k));
    const size = sizes[i] ? sizes[i] : sizes[0];
    return parseFloat((bits / Math.pow(k, i)).toFixed(dm)) + size;
};
