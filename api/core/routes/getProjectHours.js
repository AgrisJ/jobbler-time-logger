const mongoose = require('mongoose');
const Project = require('./../models/project');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.get('/api/v1/project/:projectId/:fromDate/:toDate', authorizer, (req, res) => {
    // Validate the input dates
    if (!isDate(req.params.fromDate) || !isDate(req.params.toDate)) {
        res.status(400).end();
        return;
    }
    
    // Get projects
    Project.find({_id: req.params.projectId, companyId: req._company._id, date: {
        $gte: req.params.fromDate,
        $lte: req.params.toDate
    }}, (error, results) => {
        // Check for results
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
        res.status(204).send({projects: results, newToken: req._newToken});
    });
});

module.exports = router;