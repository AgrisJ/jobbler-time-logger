const mongoose = require('mongoose');
const Session = require('./../models/session');

function postUser(server) {
    server.post('/api/v1/users', (req, res) => {
        User.create({}, (error, result) => {
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            if (results.length !== 1) {
                res.status(404).end();
                return;
            }
            
            res.status(201).end();
        });
    });
}

module.exports = postUser;