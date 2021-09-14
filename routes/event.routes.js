const express = require('express');
const { 
    uploadLogo, 
    registerGame, 
    registerMinigame, 
    registerTalkshow, 
    uploadBuktiPembayaran
} = require('../controllers/event.controllers');
const { 
    addSchedule, 
    removeSchedule, 
    editSchedule, 
    getTeams,
    getPlayers,
    getSchedule,
    blastWA,
    blastEmail,
    getPlayersByTeam,
    getLogs
} = require('../controllers/admin.controllers');
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
router.get('/data/team/:id', authMiddleware, adminMiddleware, getPlayersByTeam);
router.get('/data/schedule/:event', authMiddleware, getSchedule);
router.get('/data/player/:event', authMiddleware, adminMiddleware, getPlayers);

router.post('/blast/wa/:event', authMiddleware, adminMiddleware, blastWA);
router.post('/blast/email', authMiddleware, adminMiddleware, blastEmail);

router.get('/log/:event', authMiddleware, adminMiddleware, getLogs);

router.post('/upload-bukti', authMiddleware, upload.single('file'), uploadBuktiPembayaran);

module.exports = router;