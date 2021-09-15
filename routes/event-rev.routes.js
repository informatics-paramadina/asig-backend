const express = require('express');
const { registerGame, registerMinigame, registerTalkshow } = require('../controllers/event-rev.controllers');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.post('/daftar/game', upload.single('logo'), registerGame);
router.post('/daftar/minigame', registerMinigame);
router.post('/daftar/talkshow', registerTalkshow);

module.exports = router;