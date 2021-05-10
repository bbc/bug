const { createProxyMiddleware } = require("http-proxy-middleware");

const port = process.env.PORT_DEV_API || "3101";
const options = {
    ws: true, // proxy websockets
    target: "http://localhost:" + port,
    changeOrigin: true,
};

const bugClientProxy = createProxyMiddleware(options);

module.exports = function (app) {
    app.use(
        "/api",
        bugClientProxy
    );
    app.use(
        "/container",
        bugClientProxy
    );
    app.use(
        "/socket.io",
        bugClientProxy
    );
};
