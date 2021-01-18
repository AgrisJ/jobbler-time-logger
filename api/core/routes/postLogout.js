const mongoose = require('mongoose');
const Session = require('./../models/session');
const User = require('./../models/user');

function postLogout(server) {
    server.post('/api/v1/logout', (req, res) => {
        // Deactivate the session
        Session.updateOne({session: req._session, token: req._newToken}, {active: false}, (error, result) => {
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Respond
            res.status(200).end();
        });
    });
}

module.exports = postLogout;