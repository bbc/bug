const bcrypt = require("bcryptjs");
const saltRounds = 10;

//Setup Pin authentication
module.exports = async (password) => {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};
