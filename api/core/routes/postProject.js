const mongoose = require('mongoose');
const Project = require('./../models/project');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.post('/api/v1/project', authorizer, (req, res) => {
    // Assemble data
    let data = req.body;
    data.companyId = req._company._id;

    // Insert project data into the database
    Project.create(data, (error, result) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ', error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Respond
			res.status(200).send({ projectId: result._id, name: result.name, address: result.address, newToken: req._newToken});
    });
});

module.exports = router;