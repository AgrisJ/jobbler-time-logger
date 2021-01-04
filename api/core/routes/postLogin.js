const mongoose = require('mongoose');
const Session = require('./../models/session');

function postLogin(server) {
    server.post('/api/v1/login', (req, res) => {
        /*User.findOne({email: req.body.email, password: req.body.password}, (error, result) => {
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            if (results.length !== 1) {
                res.status(404).end();
                return;
            }
            
            // Create a new session
            Session.create({
                
            }, () => {
            
            });
            
            res.status(200).send(200);
        });*/
    });
}

module.exports = postLogin;