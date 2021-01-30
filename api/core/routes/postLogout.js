const mongoose = require('mongoose');
const Session = require('./../models/session');
const User = require('./../models/user');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.post('/api/v1/logout', authorizer, (req, res) => {
    // Deactivate the session
    Session.updateOne({session: req._session, token: req._newToken}, {active: false}, (error, result) => {
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Respond
        res.status(200).end();
    });
});

module.exports = router;