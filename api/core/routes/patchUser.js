const mongoose = require('mongoose');
const User = require('./../models/user');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.patch('/api/v1/user/:userId', authorizer, (req, res) => {
    // Get body data
    let data = req.body;

    // In case the password is being patched hash it
    if (data.password) {
        data.password = api.utils.passwordHash(req.body.password);
    }

    // Update user
    User.updateOne({_id: req.params.userId, companyId: req._company._id}, req.body, (error, result) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if user was modified
        if (result.nModified !== 1) {
            res.status(403).end();
            return;
        }
        
        // Respond
        res.status(200).send({newToken: req._newToken});
    });
});

module.exports = router;