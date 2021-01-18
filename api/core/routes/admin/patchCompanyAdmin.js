const mongoose = require('mongoose');
const Company = require('./../../models/company');

function patchCompanyAdmin(server) {
    server.patch('/api/v1/admin/company/:companyId', (req, res) => {
        Company.updateOne({_id: req.params.companyId}, req.body, (error, result) => {
            // Check for errors
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Check if company was modified
            if (result.nModified !== 1) {
                res.status(403).end();
                return;
            }
            
            // Respond
            res.status(200).end();
        });
    });
}

module.exports = patchCompanyAdmin;