const mongoose = require('mongoose');
const Project = require('./../models/project');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.delete('/api/v1/project/:projectId', authorizer, (req, res) => {    
    Project.deleteOne({_id: req.params.projectId, companyId: req._company._id}, (error, result) => {
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
        res.status(204).send({newToken: req._newToken});
    });
});

module.exports = router;