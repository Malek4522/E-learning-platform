const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public route for creating contact messages
router.post('/', contactController.createContact);

// Protected routes - require authentication
router.use(authenticate);
router.get('/', contactController.getAllContacts);
router.put('/:id/status', contactController.updateContactStatus);

module.exports = router;
