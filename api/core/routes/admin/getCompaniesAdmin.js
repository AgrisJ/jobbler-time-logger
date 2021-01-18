const mongoose = require('mongoose');
const Company = require('./../../models/company');

function getCompaniesAdmin(server) {
    server.get('/api/v1/admin/companies', (req, res) => {        
        // Insert data into the database
        Company.find({}, (error, results) => {
            // Check for errors
            if (error) {
                api.utils.log(req.path + ', error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Check if there were results
            if (!results) {
                res.status(404).end();
                return;
            }
            
            // Respond
            res.status(200).send({companies: results});
        });
    });
}

module.exports = getCompaniesAdmin;