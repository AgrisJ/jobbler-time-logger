// const mongoose = require('mongoose');
// const Session = require('./../models/session');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');
const User = require('./../models/user');

router.get('/api/v1/users', authorizer, (req, res) => {
    User.find({companyId: req._user.companyId}, (error, results) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if there were results
        if (!results) {
            res.status(404).end();
            return;
        }
        
        // Respond
        res.status(200).send({users: results, newToken: req._newToken});
    });
});

module.exports = router;