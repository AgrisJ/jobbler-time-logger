const mongoose = require('mongoose');
const Timecard = require('./../models/timecard');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.get('/api/v1/user/hours', authorizer, (req, res) => {    
    Timecard.find({userId: req._user._id}, (error, results) => {
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
        res.status(200).send({hours: results, newToken: req._newToken});
    });
});

module.exports = router;