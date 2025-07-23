const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: process.env.NODE_ENV === 'production' 
        ? 'http://backend:8081' 
        : 'http://localhost:8081',
      changeOrigin: true,
    })
  );
};
