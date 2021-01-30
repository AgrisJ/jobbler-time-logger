const mongoose = require('mongoose');
const Session = require('./../models/session');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.post('/api/v1/users', authorizer, (req, res) => {
    User.find({companyId: req._user.companyId}, (error, results) => {
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
            res.status(500).end();
            return;
        }
        
        if (!results) {
            res.status(404).end();
            return;
        }
        
        // Respond
        res.status(200).send({companies: result, newToken: req._newToken});
    });
});

module.exports = router;