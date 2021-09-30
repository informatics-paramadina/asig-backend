const express = require('express');
const sendPdf = require('../controllers/pdf.controllers');
const router = express.Router();

router.post('/pdf', sendPdf);

module.exports = router;