const express = require('express');
const { 
    registerUsers, 
    registerAdmin, 
    postLogin 
} = require('../controllers/users.controllers');
const {
    authMiddleware, 
    adminMiddleware,
} = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/usertest', (req, res) => res.send('yoii'))
router.post('/user', registerUsers);
router.post('/admin', registerAdmin);
router.post('/login', postLogin);
router.get('/auth-test', authMiddleware, (req, res) => {
    res.send("success! your role is " + req.user.userRole);
})
router.get('/admin-test', authMiddleware, adminMiddleware, (req, res) => {
    res.send('you are an ' + req.user.userRole);
})


module.exports = router;