const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const courseRoutes = require('./course.routes');
const forumRoutes = require('./forum.routes');
const progressRoutes = require('./progress.routes');
const userRoutes = require('./user.routes');

// API Routes
router.use('/v1/auth', authRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/courses', courseRoutes);
router.use('/v1/forums', forumRoutes);
router.use('/v1/progress', progressRoutes);
router.use('/v1/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

module.exports = router; 