const express = require('express');
const { uploadLogo } = require('../controllers/team.controllers');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.post('/test-upload', upload.single('logo'), uploadLogo);

module.exports = router;