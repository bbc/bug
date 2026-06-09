const DEFAULT_ALPHABET = "useandom-26T198340PX75JACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
const DEFAULT_SIZE = 21;

const randomString = (alphabet, size) => {
    const chars = typeof alphabet === "string" && alphabet.length > 0 ? alphabet : DEFAULT_ALPHABET;
    const count = Number.isFinite(Number(size)) ? Math.max(1, Number(size)) : DEFAULT_SIZE;
    let output = "";

    for (let i = 0; i < count; i += 1) {
        output += chars[Math.floor(Math.random() * chars.length)];
    }

    return output;
};

const nanoid = (size = DEFAULT_SIZE) => randomString(DEFAULT_ALPHABET, size);

const customAlphabet = (alphabet, size = DEFAULT_SIZE) => () => randomString(alphabet, size);

module.exports = {
    nanoid,
    customAlphabet,
};
