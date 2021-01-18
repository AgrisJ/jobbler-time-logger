const mongoose = require('mongoose');
const User = require('./../../models/user');

function patchUserAdmin(server) {
    server.patch('/api/v1/admin/user/:userId', (req, res) => {
        Company.updateOne({_id: req.params.userId}, req.body, (error, result) => {
            // Check for errors
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Check if user was modified
            if (result.nModified !== 1) {
                res.status(403).end();
                return;
            }
            
            // Respond
            res.status(200).end();
        });
    });
}

module.exports = patchUserAdmin;