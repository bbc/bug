"use strict";

const { customAlphabet } = require("nanoid");
const idLength = process.env.ID_LENGTH || 15;
const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';

module.exports = async () => {
    const nanoid = customAlphabet(alphabet, idLength);
    return await nanoid();
};
