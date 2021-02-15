const mongoose = require('mongoose');
const Session = require('./../models/session');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.post('/api/v1/users', authorizer, (req, res) => {
    // See if there is a user with the supplied e-mail
    User.findOne({email: req.body.email}, (error, result) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ', error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if there was a hit
        if (result) {
            res.status(409).send({newToken: req._newToken});
            return;
        }

        // Create a new email
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
});

module.exports = router;