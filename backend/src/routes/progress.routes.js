const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Progress routes
router.get('/', progressController.getAllProgress);
router.get('/:courseId', progressController.getProgress);
router.put('/:courseId', progressController.updateProgress);
router.post('/course/:courseId/reset', progressController.resetProgress);

module.exports = router; 