// Authorization middleware
module.exports = ((req, res, next) => {
    // Import database models
    const Session = require('./core/models/session');
    const User = require('./core/models/user');
    const Company = require('./core/models/company');

    // Route roles
    const routeRoles = {
        admin: [
            {method: 'get', path: '/api/v1/admin/companies'},
            {method: 'get', path: '/api/v1/admin/users'},
            {method: 'get', path: '/api/v1/admin/timecards'},
            {method: 'post', path: '/api/v1/admin/company'},
            {method: 'post', path: '/api/v1/admin/user'},
            {method: 'post', path: '/api/v1/admin/timecard'},
            {method: 'patch', path: '/api/v1/admin/company'},
            {method: 'patch', path: '/api/v1/admin/user'},
            {method: 'delete', path: '/api/v1/admin/company'},
            {method: 'delete', path: '/api/v1/admin/user'}
        ],
        company: [
            {method: 'get', path: '/api/v1/users'}, // ToDo: only companies own users
            {method: 'get', path: '/api/v1/projects'},
            {method: 'get', path: '/api/v1/user/hours'},
            {method: 'get', path: '/api/v1/user/:userId/hours/:fromDate/:toDate'},
            {method: 'get', path: '/api/v1/hours/:userId/:fromDate/:toDate/:projectId'},
            {method: 'get', path: '/api/v1/hours/project/:projectId/:fromDate/:toDate'},
            {method: 'get', path: '/api/v1/timecards/:fromDate/:toDate'},
            {method: 'post', path: '/api/v1/user'},
            {method: 'post', path: '/api/v1/project'},
            {method: 'post', path: '/api/v1/timecard/:userId'},
            {method: 'delete', path: '/api/v1/project/:projectId'},
            {method: 'delete', path: '/api/v1/user/:userId'},
            {method: 'delete', path: '/api/v1/timecard/:timecardId'},
            {method: 'patch', path: '/api/v1/user/:userId'},
            {method: 'patch', path: '/api/v1/project/:projectId'},
            {method: 'patch', path: '/api/v1/timecard/:timecardId'},
            {method: 'post', path: '/api/v1/logout'},
        ],
        employee: [
            {method: 'get', path: '/api/v1/projects'},
            {method: 'get', path: '/api/v1/user/hours'},
            {method: 'post', path: '/api/v1/timecard'},
            {method: 'post', path: '/api/v1/logout'}
        ]
    };

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
    }

    // Handle routes with session and token access
    // Get session and access token
    const session = req.header('session') || null;
    const token = req.header('token') || null;
    
    // Deny requests with no session or token
    if (!session /*|| !token*/) {
        res.status(401).end();
        return;
    }

    // Get user data
    Session.findOne({session: session/*, token: token*/}, (error, result) => {        
        // Check for errors & if a result was returned
			// if (!result) window.reload();
        if (error) {res.status(404).end(); return;}
        if (!result) {res.status(401).end(); return;}
        
        // Remember the session for later use
        req._session = session;
        
        // Get user role
        User.findOne({_id: result.userId}, (error, result) => {
            // Check for errors & if a result was returned
            if (error) {res.status(404).end(); return;}
            if (!result) {res.status(401).end(); return;}

            // Remember user data for further use in the endpoint that was called
            req._user = result;
            
            // Get company data
            Company.findOne({_id: result.companyId}, (error, result) => {
                // Check for errors & if a result was returned
                if (error) {res.status(404).end(); return;}
                if (!result) {res.status(401).end(); return;}
                
                // Remember company for further use
                req._company = result;
            
                // Remember for forbidden response
                let authorized = false;
            
                // Look for a matching route and request method
                for (let i = 0; i < routeRoles[req._user.role].length; i++) {
                    if (routeRoles[req._user.role][i].method === req.method.toLowerCase() &&  routeRoles[req._user.role][i].path === req.route.path) {
                        // Generate a new token
                        const newToken = api.utils.randomString(64);
                        
                        // Prevent forbidden response
                        authorized = true;
                        
                        // Save the new token in the database
                        /*Session.updateOne({session: session, token: token}, {token: newToken}, (error, result) => {
                            // Check for errors
                            if (error) {res.status(404).end(); return;}
                            
                            // Check if session was modified
                            if (result.nModified !== 1) {
                                res.status(403).end();
                                return;
                            }
                            
                            // Remember the newly made token
                            req._newToken = newToken;
                        
                            // Proceed to request handling in the endpoint that was called
                            return next();
                        });*/
                        
                        // Remember the newly made token
                        // Just not to break the newToken values in employee and company routes
                        // To be deleted when token comes back
                        req._newToken = newToken;
                        
                        // Proceed to request handling in the endpoint that was called
                        return next();
                    }
                }
                
                // Respond
                if (!authorized) {
                    res.status(403).end();
                    return;
                }
            });
        });
    });
});