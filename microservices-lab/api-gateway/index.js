const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

const createProxy = (target, prefix) =>
    createProxyMiddleware({
        target,
        changeOrigin: true,
        logger: console,
        pathRewrite: (path, req) => {
            // Express strips the prefix, so we add it back manually
            const newPath = `/${prefix}${path}`;
            console.log(`[REWRITE] ${path} → ${newPath}`);
            return newPath;
        },
        on: {
            proxyReq: (proxyReq, req) => {
                console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${target}${proxyReq.path}`);
            },
            proxyRes: (proxyRes, req) => {
                console.log(`[RESPONSE] ${proxyRes.statusCode} ← ${target}${req.path}`);
            },
            error: (err, req, res) => {
                console.error(`[ERROR] ${err.message}`);
                res.status(502).json({ error: 'Bad Gateway', detail: err.message });
            },
        },
    });

app.use('/items', createProxy('http://item-service:8081', 'items'));
app.use('/orders', createProxy('http://order-service:8082', 'orders'));
app.use('/payments', createProxy('http://payment-service:8083', 'payments'));

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});