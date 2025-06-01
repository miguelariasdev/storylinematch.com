const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate-response', aiController.generateResponse);
router.get('/search-movie', aiController.searchMovie);

module.exports = router;
