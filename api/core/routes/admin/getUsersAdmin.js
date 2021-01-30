const mongoose = require('mongoose');
const User = require('./../../models/user');
const express = require("express");
const router = express.Router();
const authorizer = require('../../../authorizer');

router.get('/api/v1/admin/users', authorizer, (req, res) => {        
    // Insert data into the database
    User.find({}, (error, results) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ', error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if there were results
        if (!results) {
            res.status(404).end();
            return;
        }
        
        // Respond
        res.status(200).send({users: results});
    });
});

module.exports = router;