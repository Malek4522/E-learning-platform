const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');
const { validateRegistration } = require('../middleware/validation.middleware');

// Apply auth and admin middleware to all routes
router.use(authenticate, isAdmin);

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:identifier', adminController.getUserByIdentifier);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Teacher management
router.post('/teachers', validateRegistration, adminController.registerTeacher);

module.exports = router; 