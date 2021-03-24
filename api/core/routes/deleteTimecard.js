const mongoose = require('mongoose');
const Timecard = require('./../models/timecard');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.delete('/api/v1/timecard/:timecardId', authorizer, (req, res) => {    
    Timecard.deleteOne({_id: req.params.timecardId, companyId: req._company._id}, (error, result) => {
        // Check for results
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if it was deleted
        if (result.deletedCount !== 1) {
            res.status(404).end();
            return;
        }
        
        // Respond
        res.status(200).send({newToken: req._newToken, cardId: req.params.timecardId});
    });
});

module.exports = router;