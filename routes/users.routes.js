const express = require('express');
const { 
    registerUsers, 
    registerAdmin, 
    postLogin 
} = require('../controllers/users.controllers');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/usertest', (req, res) => res.send('yoii'))
router.post('/user', registerUsers);
router.post('/admin', registerAdmin);
router.post('/login', postLogin);
router.get('/auth-test', authMiddleware, (req, res) => {
    res.send(req.user);
})

module.exports = router;