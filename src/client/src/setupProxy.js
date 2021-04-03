const { createProxyMiddleware } = require('http-proxy-middleware');

let port = process.env.PORT_DEV_API || '3101';

module.exports = function(app) {
  app.use('/api',
    createProxyMiddleware({
      target: 'http://localhost:'+port,
      changeOrigin: true,
    })
  );
};