const Course = require('../models/Course');

// Create new course
exports.createCourse = async (req, res) => {
    try {
        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            key: req.body.key,
            categories: req.body.categories,
            teacher_id: req.user.id,
            chapters: req.body.chapters
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error('Error in createCourse:', error);
        res.status(500).json({ 
            message: 'Error creating course',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('teacher_id', 'email profile')
            .select('-key -chapters.lessons.quiz.questions.correct_answer_index');
        res.json(courses);
    } catch (error) {
        console.error('Error in getCourses:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
};

// Get single course
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('teacher_id', 'email profile')
            .populate('reviews.user_id', 'email profile')
            .select('-key');
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json(course);
    } catch (error) {
        console.error('Error in getCourse:', error);
        res.status(500).json({ message: 'Error fetching course' });
    }
};

// Update course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the teacher of the course
        if (course.teacher_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        // List of fields that can be updated
        const allowedUpdates = {
            'title': req.body.title,
            'description': req.body.description,
            'chapters': req.body.chapters,
            'key': req.body.key,
            'categories' : req.body.categories
        }; 
        
        Object.keys(allowedUpdates).forEach(key => 
            allowedUpdates[key] === undefined && delete allowedUpdates[key]
        );
        
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: allowedUpdates },
            { new: true, runValidators: true }
        );

        res.json(updatedCourse);
    } catch (error) {
        console.error('Error in updateCourse:', error);
        res.status(500).json({ message: 'Error updating course' });
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the teacher of the course
        if (course.teacher_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        await course.remove();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error in deleteCourse:', error);
        res.status(500).json({ message: 'Error deleting course' });
    }
}; 