const express = require('express');
const { getGameProjects, getAnimationProjects } = require('../controllers/project.controllers');
const router = express.Router();

router.get('/game-project', getGameProjects);
router.get('/animation-project', getAnimationProjects);

module.exports = router;