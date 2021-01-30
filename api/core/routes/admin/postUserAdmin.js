const mongoose = require('mongoose');
const User = require('./../../models/user');
const Company = require('./../../models/company');
const express = require("express");
const router = express.Router();
const authorizer = require('../../../authorizer');

router.post('/api/v1/admin/user', authorizer, (req, res) => {
    // Get body data
    let data = req.body;
    
    // Generate a password hash
    data.password = api.utils.passwordHash(req.body.password);
    
    // See if the company exists
    Company.exists({_id: data.companyId}, (error, result) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ', error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if company was found
        if (!result) {
            res.status(401).send({error: "bad company id"});
            return;
        }

        // Insert data into the database
        User.create(data, (error, result) => {
            // Check for errors
            if (error) {
                api.utils.log(req.path + ', error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Respond
            res.status(200).send({"userId": result._id});
        });
    });
});

module.exports = router;