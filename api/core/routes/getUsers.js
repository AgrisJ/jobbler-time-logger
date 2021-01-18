const mongoose = require('mongoose');
const Session = require('./../models/session');

function getUsers(server) {
    server.post('/api/v1/users', (req, res) => {
        User.find({companyId: req._user.companyId}, (error, results) => {
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            if (!results) {
                res.status(404).end();
                return;
            }
            
            // Respond
            res.status(200).send({companies: result, newToken: req._newToken});
        });
    });
}

module.exports = getUsers;