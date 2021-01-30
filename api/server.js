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

    // Run the api core tests

    // Enable body and url params
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({extended: true}));
    
    // Internal server error handling
    /*server.use((err, req, res, next) => {
        if (!error) {
            return next();
        }
    
        api.utils.log(err.stack);
        res.status(500).end();
    });*/

    // Import general routes
    const postLogin = require('./core/routes/postLogin.js');
    const postLogout = require('./core/routes/postLogout.js');
    const getUsers = require('./core/routes/getUsers');
    const deleteProject = require('./core/routes/deleteProject');
    const deleteTimecard = require('./core/routes/deleteTimecard');
    const deleteUser = require('./core/routes/deleteUser');
    const getProjectHours = require('./core/routes/getProjectHours');
    const getProjects = require('./core/routes/getProjects');
    const getTimecards = require('./core/routes/getTimecards');
    const getUserHours = require('./core/routes/getUserHours');
    const getUserHoursCompany = require('./core/routes/getUserHoursCompany');
    const patchProject = require('./core/routes/patchProject');
    const patchTimecard = require('./core/routes/patchTimecard');
    const postTimecardCompany = require('./core/routes/postTimecardCompany');
    const patchUser = require('./core/routes/patchUser');
    const postTimecard = require('./core/routes/postTimecard');
    const postUser = require('./core/routes/postUser');
    const postProject = require('./core/routes/postProject');
    
    // Use general routes
    server.use('/', postTimecard)
    server.use('/', postTimecardCompany)
    server.use('/', postLogin)
    server.use('/', postLogout)
    server.use('/', getUsers)
    server.use('/', deleteProject)
    server.use('/', deleteTimecard)
    server.use('/', deleteUser)
    server.use('/', getProjectHours)
    server.use('/', getProjects)
    server.use('/', getTimecards)
    server.use('/', getUserHours)
    server.use('/', getUserHoursCompany)
    server.use('/', getUsers)
    server.use('/', patchProject)
    server.use('/', patchTimecard)
    server.use('/', patchUser)
    server.use('/', postTimecard)
    server.use('/', postTimecardCompany)
    server.use('/', postUser)
    server.use('/', postProject)
    
    // Import admin routes
    const postCompanyAdmin = require('./core/routes/admin/postCompanyAdmin');
    const postUserAdmin = require('./core/routes/admin/postUserAdmin');
    const patchCompanyAdmin = require('./core/routes/admin/patchCompanyAdmin');
    const patchUserAdmin = require('./core/routes/admin/patchUserAdmin');
    const getCompaniesAdmin = require('./core/routes/admin/getCompaniesAdmin');
    const getUsersAdmin = require('./core/routes/admin/getUsersAdmin');
    const deleteCompanyAdmin = require('./core/routes/admin/deleteCompanyAdmin');
    const deleteUserAdmin = require('./core/routes/admin/deleteUserAdmin');
    
    // Use admin routes
    server.use('/', postCompanyAdmin);
    server.use('/', postUserAdmin);
    server.use('/', patchCompanyAdmin);
    server.use('/', patchUserAdmin);
    server.use('/', getCompaniesAdmin);
    server.use('/', getUsersAdmin);
    server.use('/', deleteCompanyAdmin);
    server.use('/', deleteUserAdmin);

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