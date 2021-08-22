const express = require('express');
const { getProjects } = require('../controllers/project.controllers');
const router = express.Router();

router.get('/test', getProjects);

module.exports = router;