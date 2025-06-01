const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/create-user', authController.createUser);
router.get('/verify-email', authController.verifyEmail);
router.post('/request-reset-password', authController.requestResetPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
