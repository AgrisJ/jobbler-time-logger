global.config = require('./config');
global.api = require('./core/api');
const mongoose = require('mongoose');
const express = require('express');
const fork = require('child_process').fork;

// Inform about starting server
console.log('\x1b[33mStarting server\x1b[0m');

// Establish a database connection
process.stdout.write('Establishing database connection...');
const dbAddress = config.API_DEV_MODE ? config.DB_ADDRESS_DEV : config.DB_ADDRESS_PROD;
mongoose.connect(dbAddress, {useNewUrlParser: true, useUnifiedTopology: true});
global.db = mongoose.connection;

// Log unexpected (unhandled) errors
process.on('uncaughtException', function (exception) {
    console.log('\x1b[31mUnexpected exception\x1b[0m');
    api.utils.log(exception);
    process.exit(1);
});

// Log database errors
db.on('error', (error) => {
    api.utils.log(error);
    process.exit(1);
});

// Prevent immediate server exit
process.stdin.resume();

// Handle server exit
function closeServer(options, exitCode) {
    // Log to console and close mysql connection
    if (options.cleanup) {
		console.log('\x1b[33mServer shutting down\x1b[0m');

        // Perform any cleanup operations before closing the server here
        // ..
    }

    // Exit
    if (options.exit) { 
		process.exit();
    }
}

// Handle server exit, close, crash, etc. events
process.on('exit', closeServer.bind(null, {cleanup:true}));
process.on('SIGINT', closeServer.bind(null, {exit:true}));
process.on('SIGUSR1', closeServer.bind(null, {exit:true}));
process.on('SIGUSR2', closeServer.bind(null, {exit:true}));
process.on('uncaughtException', closeServer.bind(null, {exit:true}));

// Once a connection is established run the rest of the server code
db.once('open', () => {
    // Notify of database connection success
    console.log('\x1b[32mOK\x1b[0m');
    
    // Run proxy
    if (config.API_DEV_PROXY) {
        const proxy = fork('./proxy.js');
    }

    // Import database models
    const Session = require('./core/models/session');
    const User = require('./core/models/user');

    // Run the api core tests

    // Enable body and url params
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({extended: true}));

    // Route roles
    const routes = {
        admin: [],
        company: [],
        user: []
    };

    // Authorization
    server.use((req, res, next) => {    
        // Allow access to all routes with admin key
        if (req.header.adminKey && req.header.adminKey === config.API_ADMIN_KEY) {
            // If safe mode is enabled, return a 404
            if (config.API_SAFE_MODE) {
                res.status(404).end();
                return;
            }

            return next();
        }

        // Handle routes with session and token access
        // Get session and access token
        const session = req.header.session || null;
        const token = req.header.token || null;

        // Get user data
        /*Session.findOne({_id: req.session, token: req.token}, (error, result) => {
            // req._user = result ?
            
            // Check if user role allows accessing the route
            if (!routes[result.role].includes(req.originalUrl)) {
                res.status(403).end();
                return;
            }
            
            // Get company data
            Session.findOne({_id: req.session, token: req.token}, (error, result) => {
                // req._company = result ?
                return next();
            });
        });*/
        
        // Deny requests that don't have priviledges specified
    });
    
    // Test route
    

    // Import general routes
    [   
        'postLogin'
    ].map((route) => {
        require('./core/routes/' + route + '.js').call(null, server)
    });
    
    // Import admin routes
    [   
        'postUserAdmin',
        'deleteUserAdmin'
    ].map((route) => {
        require('./core/routes/admin/' + route + '.js').call(null, server)
    });

    // Run the api server
    server.listen(config.API_PORT, () => {
        console.log('\x1b[32m\nServer started\x1b[0m' + '\nListening on: http://localhost:' + config.API_PORT);
        
        // Inform about development proxy running
        if (config.API_DEV_PROXY) {
            console.log('Proxying requests https://localhost -> http://localhost:8080');
        }

        // Run api endpoint tests
        
    });
});