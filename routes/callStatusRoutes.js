const express = require('express');
const router = express.Router();
const callStatusSchedule = require('../util/schedule');
router.post('/events',callStatusSchedule.callStatus);

module.exports = router;