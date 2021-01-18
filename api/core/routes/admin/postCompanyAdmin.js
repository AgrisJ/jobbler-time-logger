const mongoose = require('mongoose');
const Company = require('./../../models/company');

function postCompanyAdmin(server) {
    server.post('/api/v1/admin/company', (req, res) => {
        Company.create(req.body, (error, result) => {
            // Check for errors
            if (error) {
                api.utils.log(req.path + ', error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Check if there were results
            
            // Respond
            res.status(200).send({companyId: result._id});
        });
    });
}

module.exports = postCompanyAdmin;