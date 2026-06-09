module.exports = (ms, options = {}) => {
    const value = Number(ms);
    const timeoutMs = Number.isFinite(value) ? Math.max(0, value) : 0;

    return new Promise((resolve) => {
        setTimeout(() => resolve(options.value), timeoutMs);
    });
};

module.exports.reject = (ms, options = {}) => {
    const value = Number(ms);
    const timeoutMs = Number.isFinite(value) ? Math.max(0, value) : 0;
    const message = options.value !== undefined ? options.value : "Delay rejected";

    return new Promise((_, reject) => {
        setTimeout(() => reject(message), timeoutMs);
    });
};

module.exports.range = (min, max, options = {}) => {
    const minNum = Number.isFinite(Number(min)) ? Number(min) : 0;
    const maxNum = Number.isFinite(Number(max)) ? Number(max) : minNum;
    const lower = Math.min(minNum, maxNum);
    const upper = Math.max(minNum, maxNum);
    const delayMs = Math.floor(Math.random() * (upper - lower + 1)) + lower;

    return module.exports(delayMs, options);
};
