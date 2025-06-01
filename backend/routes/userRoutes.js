const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/info', authenticateToken, userController.getUserInfo);
router.get('/history', authenticateToken, userController.getStoryHistory);
router.post('/history', authenticateToken, userController.insertStoryHistory);

router.get('/favorites', authenticateToken, userController.getFavorites);
router.post('/favorites', authenticateToken, userController.insertFavorite);
router.delete('/favorites/:title', authenticateToken, userController.deleteFavorite);

module.exports = router;
