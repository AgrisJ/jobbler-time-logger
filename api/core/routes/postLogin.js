const mongoose = require('mongoose');
const Session = require('./../models/session');
const User = require('./../models/user');
const express = require("express");
const router = express.Router();
const authorizer = require('../../authorizer');

router.post('/api/v1/login', authorizer, (req, res) => {
    User.findOne({email: req.body.email, password: api.utils.passwordHash(req.body.password)}, (error, result) => {
        // Check for errors
        if (error) {
            api.utils.log(req.route.path + ' , error: ' + error);
            res.status(500).end();
            return;
        }
        
        // Check if there were results returned
        if (!result) {
            res.status(404).end();
            return;
        }
        
        // Remember user's role for later
        const userRole = result.role;

        // Remember user's role for later
        const username = result.fullName;

        // Remember user's companyId for later
        const companyId = result.companyId;
        
        // Generate a session id and a token
        const session = api.utils.randomString(64);
        const token = api.utils.randomString(64);
        const ttl = (req.body.keepMeLoggedIn ? 60 * 60 * 24 * 365 : 3600);
        
        // ToDo:
        // Clean up old sessions upon login
        
        // Create a new session
        Session.create({userId: result._id, session: session, token: token, ttl: ttl}, (error, result) => {
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }

            // Respond
            res.status(200).send({ session: session, companyId, token: token, ttl: ttl, userId: result.userId, role: userRole, fullName: username });
        });
    });
});

module.exports = router;