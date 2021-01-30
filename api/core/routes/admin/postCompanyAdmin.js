const mongoose = require('mongoose');
const Company = require('./../../models/company');
const express = require("express");
const router = express.Router();
const authorizer = require('../../../authorizer');

router.post('/api/v1/admin/company', authorizer, (req, res) => {
    Company.create(req.body, (error, result) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ', error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if there were results
        
        // Respond
        res.status(200).send({companyId: result._id});
    });
});

module.exports = router;