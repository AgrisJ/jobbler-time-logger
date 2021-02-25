const mongoose = require('mongoose');
const User = require('./../../models/user');
const Company = require('./../../models/company');
const Timecard = require('./../../models/timecard');
const Project = require('./../../models/project');
const express = require("express");
const router = express.Router();
const authorizer = require('../../../authorizer');

router.post('/api/v1/admin/timecard', authorizer, (req, res) => {    
    // See if the user exists
    User.exists({_id: req.body.userId, companyId: req.body.companyId}, (error, result) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ', error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if company was found
        if (!result) {
            res.status(401).send({error: "bad user or company id or both"});
            return;
        }
        
        // See if the project exists
        Project.exists({_id: req.body.projectId, companyId: req.body.companyId}, (error, result) => {
            // Check for errors
            if (error) {
                api.utils.log(req.route.path + ', error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Check if project was found
            if (!result) {
                res.status(401).send({error: "bad project id"});
                return;
            }

            // Insert data into the database
            Timecard.create(req.body, (error, result) => {
                // Check for errors
                if (error) {
                    api.utils.log(req.path + ', error: ' + error);
                    res.status(500).end();
                    return;
                }
                
                // Respond
                res.status(200).send({"timecardId": result._id});
            });
        });
    });
});

module.exports = router;