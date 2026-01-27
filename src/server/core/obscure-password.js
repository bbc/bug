module.exports = function (password) {
    if (!password || password.length <= 2) {
        return "*".repeat(password.length);
    }

    return (
        password[0] +
        "*".repeat(password.length - 2) +
        password[password.length - 1]
    );
}