const express = require('express');
const { 
    uploadLogo, 
    registerGame, 
    registerMinigame, 
    registerTalkshow 
} = require('../controllers/event.controllers');
const { 
    addSchedule, 
    removeSchedule, 
    editSchedule, 
    getTeams,
    getPlayers,
    getSchedule
} = require('../controllers/schedule.controllers');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.post('/test-upload', upload.single('logo'), uploadLogo);
router.post('/register/game', authMiddleware, upload.single('logo'), registerGame);
router.post('/register/minigame', authMiddleware, registerMinigame);
router.post('/register/talkshow', authMiddleware, registerTalkshow);

router.post('/schedule/add', authMiddleware, adminMiddleware, addSchedule);
router.delete('/schedule/remove', authMiddleware, adminMiddleware, removeSchedule);
router.put('/schedule/edit', authMiddleware, adminMiddleware, editSchedule);

router.get('/data/team', authMiddleware, adminMiddleware, getTeams);
router.get('/data/schedule/:event', authMiddleware, adminMiddleware, getSchedule);
router.get('/data/player/:event', authMiddleware, adminMiddleware, getPlayers);

module.exports = router;