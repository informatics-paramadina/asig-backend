const express = require('express');
const { stuff } = require('../controllers/excel.controllers');
const sendPdf = require('../controllers/pdf.controllers');
const router = express.Router();

router.post('/pdf', sendPdf);
router.get('/xlsx', stuff);

module.exports = router;