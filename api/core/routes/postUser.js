// const mongoose = require('mongoose');
// const Session = require('./../models/session');
const User = require('./../models/user');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.post('/api/v1/user', authorizer, (req, res) => {
    User.create(req.body, (error, result) => {
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Respond
			res.status(201).send({ userId: result._id, name: result.fullName, newToken: req._newToken });
    });
});

module.exports = router;