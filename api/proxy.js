const fs = require('fs');
const http = require('http');
httpProxy = require('http-proxy');
global.config = require('./config');
global.api = require('./core/api');

const proxy = httpProxy.createServer({
    ssl: {
        key: fs.readFileSync('./dev/certs/dev.key'),
        cert: fs.readFileSync('./dev/certs/dev.cert') 
    },
    target: 'http://localhost:8080',
    secure: false
}).listen(443);

// Log errors
proxy.on('error', (e) => {
    api.utils.log('Proxy error: ' + e);
});