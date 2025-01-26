const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateProfileUpdate } = require('../middleware/validation.middleware');

// Apply auth middleware to all routes
router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateProfileUpdate, userController.updateProfile);

// Dashboard routes
router.get("/dashboard", userController.getDashboard);

// Course enrollment routes
router.get('/courses', userController.getEnrolledCourses);
router.post('/courses/:key/enroll', userController.enrollCourse_key);
router.get('/courses/enrolled-students', userController.getEnrolledStudents);
router.delete('/courses/remove-student', userController.removeStudentFromCourse);


module.exports = router; 