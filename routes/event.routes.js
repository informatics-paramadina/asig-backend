const express = require('express');
const { 
    uploadLogo, 
    registerGame, 
    registerMinigame, 
    registerTalkshow 
} = require('../controllers/event.controllers');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.post('/test-upload', upload.single('logo'), uploadLogo);
router.post('/register/game', authMiddleware, upload.single('logo'), registerGame);
router.post('/register/minigame', authMiddleware, registerMinigame);
router.post('/register/talkshow', authMiddleware, registerTalkshow);

module.exports = router;