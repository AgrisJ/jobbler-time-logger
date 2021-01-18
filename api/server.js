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
    //process.exit(1);
});

// Log unexpected promise rejections
process.on('unhandledRejection', function(reason, p){
    console.log('\x1b[31mUnhandled rejection\x1b[0m');
    api.utils.log(exception);
    //process.exit(1);
});

// Log database errors
db.on('error', (error) => {
    api.utils.log(error);
    //process.exit(1);
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
    const routeRoles = {
        admin: [
            {method: 'get', path: '/api/v1/admin/companies'},
            {method: 'get', path: '/api/v1/admin/users'},
            {method: 'post', path: '/api/v1/admin/company'},
            {method: 'post', path: '/api/v1/admin/user'},
            {method: 'patch', path: '/api/v1/admin/company'},
            {method: 'patch', path: '/api/v1/admin/user'},
            {method: 'delete', path: '/api/v1/admin/company'},
            {method: 'delete', path: '/api/v1/admin/user'}
        ],
        company: [
            {method: 'get', path: '/api/v1/users'} // ToDo: only companies own users
        ],
        employee: []
    };
    
    // Internal server error handling
    /*server.use((err, req, res, next) => {
        if (!error) {
            return next();
        }
    
        api.utils.log(err.stack);
        res.status(500).end();
    });*/

    // Authorization
    server.use((req, res, next) => {
        // Allow access to all routes with admin key
        if (req.header('adminKey') && req.header('adminKey') === config.API_ADMIN_KEY) {
            // If safe mode is enabled, return a 404
            if (config.API_SAFE_MODE) {
                res.status(404).end();
                return;
            }

            return next();
        }
        
        // Allow login route without api key or session & token
        if (req.originalUrl === '/api/v1/login') {
            return next();
            console.log('runs');
        }

        // Handle routes with session and token access
        // Get session and access token
        const session = req.header('session') || null;
        const token = req.header('token') || null;

        // Get user data
        Session.findOne({session: session, token: token}, (error, result) => {        
            // Check for errors & if a result was returned
            if (error) {res.status(404).end(); return;}
            if (!result) {res.status(401).end(); return;}
            
            // Get user role
            User.findOne({_id: result._id}, (error, result) => {
                // Check for errors & if a result was returned
                if (error) {res.status(404).end(); return;}
                if (!result) {res.status(401).end(); return;}
            
                // Remember user data for further use in the endpoint that was called
                req._user = result;
            
                // Look for a matching route and request method
                for (let i = 0; i < routeRoles[result.role].length; i++) {
                    if (routeRoles[result.role].method === req.method &&  req.originalUrl.includes(routeRoles[result.role].path)) {
                        // Generate a new token
                        const newToken = api.utils.randomString(64);
                        
                        // Save the new token in the database
                        User.updateOne({session: session, token: token}, {token: newToken}, (error, result) => {
                            // Check for errors
                            if (error) {res.status(404).end(); return;}
                            
                            // Remember the newly made token
                            req._newToken = newToken;
                        
                            // Proceed to request handling in the endpoint that was called
                            return next();
                        });
                    }
                }
                
                // Respond
                res.status(403).end();
                return;
            });
        });
        
        // Deny requests that don't have priviledges specified (?)
        //res.status(403).end();
        //return;
    });

    // Import general routes
    [   
        'postLogin',
        'getUsers'
    ].map((route) => {
        require('./core/routes/' + route + '.js').call(null, server)
    });
    
    // Import admin routes
    [   
        'postCompanyAdmin',
        'postUserAdmin',
        'patchCompanyAdmin',
        'patchUserAdmin',
        'getCompaniesAdmin',
        'getUsersAdmin',
        'deleteCompanyAdmin',
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