const mongoose = require('mongoose');
const User = require('./../../models/user');
const express = require("express");
const router = express.Router();
const authorizer = require('../../../authorizer');

router.delete('/api/v1/admin/user/:userId', authorizer, (req, res) => {    
    User.deleteOne({_id: req.params.userId}, (error, result) => {
        // Check for results
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
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

module.exports = router;