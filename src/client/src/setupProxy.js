const { createProxyMiddleware } = require("http-proxy-middleware");

const port = process.env.PORT_DEV_API || "3101";

const options = {
  target: "http://localhost:" + port,
  changeOrigin: true,
  ws: true,
};

module.exports = function (app) {
  app.use("/api", createProxyMiddleware(["API Development Proxy"], options));
  app.use("/container", createProxyMiddleware(["Container Development Proxy"], options));
};
