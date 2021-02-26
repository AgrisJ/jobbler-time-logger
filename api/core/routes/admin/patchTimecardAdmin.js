const mongoose = require('mongoose');
const Timecard = require('./../../models/timecard');
const express = require("express");
const router = express.Router();
const authorizer = require('../../../authorizer');

router.patch('/api/v1/admin/timecard/:timecardId', authorizer, (req, res) => {
	Timecard.updateOne({ _id: req.params.timecardId }, req.body, (error, result) => {
		// Check for errors
		if (error) {
			api.utils.log(req.route.path + ' , error: ' + error);
			res.status(500).end();
			return;
		}

		// Check if user was modified
		if (result.nModified !== 1) {
			res.status(403).end();
			return;
		}

		// Respond
		res.status(200).end();
	});
});

module.exports = router;