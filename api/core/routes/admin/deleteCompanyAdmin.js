const mongoose = require('mongoose');
const Company = require('./../../models/company');

function deleteCompanyAdmin(server) {
    server.delete('/api/v1/admin/company/:companyId', (req, res) => {
        Company.deleteOne({_id: req.params.companyId}, (error, result) => {
            // Check for results
            if (error) {
                api.utils.log(req.path + ' , error: ' + error);
                res.status(500).end();
                return;
            }
            
            // Check if it was deleted
            if (result.deletedCount !== 1) {
                res.status(404).end();
                return;
            }
            
            // Respond
            res.status(204).end();
        });
    });
}

module.exports = deleteCompanyAdmin;