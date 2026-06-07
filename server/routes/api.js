const express = require('express');
const router = express.Router();
const banController = require('../controllers/banController');

// Routes
router.get('/check-ban', banController.checkBanStatus);
router.get('/ban-history', banController.getBanHistory);
router.get('/account-info', banController.getAccountInfo);
router.post('/report-ban', banController.reportBan);

module.exports = router;