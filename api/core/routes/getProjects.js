const mongoose = require('mongoose');
const Projects = require('./../models/project');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.get('/api/v1/projects', authorizer, (req, res) => {        
    // Insert data into the database
    Projects.find({companyId: req._company._id}, (error, results) => {
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
        res.status(200).send({projects: results, newToken: req._newToken});
    });
});

module.exports = router;