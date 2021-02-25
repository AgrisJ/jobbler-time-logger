const mongoose = require('mongoose');
const Timecard = require('./../../models/timecard');
const express = require("express");
const router = express.Router();
const authorizer = require('../../../authorizer');
const { isDate } = api.validators;

router.get('/api/v1/admin/timecards/:fromDate/:toDate', authorizer, (req, res) => {
    // Validate date
	if (!isDate(req.params.fromDate) || !isDate(req.params.toDate)) {
        res.status(400).end();
        return;
    }

    // Get timecards from the database
    Timecard.find({startTime: {
        $gte: req.params.fromDate,
        $lte: req.params.toDate
    }}, (error, results) => {
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
        res.status(200).send({timecards: results});
    });
});

module.exports = router;