const express = require('express')
const router = express.Router()
const {SignUp,login,logout,verifyToken} = require('../controllers/authControllers')
const requireLogin = require('../middlewares/authMiddleware');

router.post('/signup',SignUp)
router.get('/check-auth', requireLogin, (req, res) => {
    res.status(200).json({ success: true, message: "User is authenticated" });
  });
router.post('/login',login)
router.post('/logout',logout)
router.get('/verifyToken',verifyToken)

module.exports = router