const mongoose = require('mongoose');
const User = require('./../models/user');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.post('/api/v1/user', authorizer, (req, res) => {
    // Get body data
    let data = req.body;
    
    // Generate a password hash
    data.password = api.utils.passwordHash(req.body.password);
    
    // Add the user
    User.create(req.body, (error, result) => {
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Respond
        res.status(201).send({userId: result._id, newToken: req._newToken});
    });
});

module.exports = router;