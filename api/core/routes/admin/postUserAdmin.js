const mongoose = require('mongoose');
const User = require('./../../models/user');

function postUserAdmin(server) {
    server.post('/api/admin/user', (req, res) => {
        User.create(req.body, (error, result) => {
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            res.status(200).send(result._id);
        });
    });
}

module.exports = postUserAdmin;