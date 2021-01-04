const mongoose = require('mongoose');
const User = require('./../../models/user');

function deleteUserAdmin(server) {
    server.post('/api/admin/user/:userId', (req, res) => {
        User.deleteOne(req.body, (error, result) => {
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                console.log('ran1');
            }
            console.log('ran2');
            
            res.status(200).end();
            console.log('ran3');
        });
    });
}

module.exports = deleteUserAdmin;