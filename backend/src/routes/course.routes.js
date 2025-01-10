const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const {authenticate} = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authenticate);

router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/enrolled', courseController.getEnrolledCourses);
router.get('/:id', courseController.getCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router; 