const mongoose = require('mongoose');
const Timecard = require('./../models/timecard');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.post('/api/v1/timecard', authorizer, (req, res) => {
    // Assemble data
    let data = req.body;
    data.userId = req._user._id;
    data.companyId = req._company._id;

    // Insert timecard data into the database
    Timecard.create(data, (error, result) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ', error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Respond
        res.status(200).send({timecardId: result._id, newToken: req._newToken});
    });
});

module.exports = router;