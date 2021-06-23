const { createProxyMiddleware } = require("http-proxy-middleware");

const port = process.env.PORT_DEV_API || "3101";

const options = {
    target: "http://localhost:" + port,
    changeOrigin: true,
};

module.exports = function (app) {
    app.use("/api", createProxyMiddleware(options));
    app.use("/container", createProxyMiddleware(options));
    app.use(
        createProxyMiddleware("/socket.io", {
            target: "ws://localhost:" + port,
            changeOrigin: true,
            ws: true,
        })
    );
};
