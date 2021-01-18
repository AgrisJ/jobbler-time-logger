const mongoose = require('mongoose');
const User = require('./../../models/user');

function deleteUserAdmin(server) {
    server.delete('/api/v1/admin/user/:userId', (req, res) => {    
        User.deleteOne({_id: req.params.userId}, (error, result) => {
            // Check for results
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Check if it was deleted
            if (result.deletedCount !== 1) {
                res.status(404).end();
                return;
            }
            
            // Respond
            res.status(204).end();
        });
    });
}

module.exports = deleteUserAdmin;