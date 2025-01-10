const Course = require('../models/Course');
const Forum = require('../models/Forum');

// Create new course
exports.createCourse = async (req, res) => {
    try {
        // Start a session for transaction
        const session = await Course.startSession();
        session.startTransaction();

        try {
            const course = new Course({
                title: req.body.title,
                description: req.body.description,
                key: req.body.key,
                categories: req.body.categories,
                teacher_id: req.user.id,
                chapters: req.body.chapters
            });

            await course.save({ session });

            // Create associated forum
            const forum = new Forum({
                course_id: course._id
            });

            await forum.save({ session });

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            // Convert to object with virtuals before sending response
            const courseWithVirtuals = course.toObject({ virtuals: true });
            res.status(201).json(courseWithVirtuals);
        } catch (error) {
            // If any error occurs, abort transaction
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
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
        let courses = await Course.find()
            .populate('teacher_id', 'email profile')
            .select('-key -chapters.lessons.quiz.questions.correct_answer_index');
        
        // Convert to plain objects with virtuals explicitly
        courses = courses.map(course => course.toObject({ virtuals: true }));
        
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
        
        // Convert to plain object with virtuals
        //const courseWithVirtuals = course.toObject({ virtuals: true });
        res.json(course);
    } catch (error) {
        console.error('Error in getCourse:', error);
        res.status(500).json({ message: 'Error fetching course' });
    }
};

// Get enrolled courses for a user
exports.getEnrolledCourses = async (req, res) => {
    try {
        const courses = await Course.find({ students_enrolled: req.user.id })
            .populate('teacher_id', 'email profile')
            .select('-key');

        res.json(courses);
    } catch (error) {
        console.error('Error in getEnrolledCourses:', error);
        res.status(500).json({ message: 'Error fetching enrolled courses' });
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
            { 
                new: true, 
                runValidators: true,
                lean: { virtuals: true }
            }
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
        // Start a session for transaction
        const session = await Course.startSession();
        session.startTransaction();

        try {
            const course = await Course.findById(req.params.id);
            

            // Check if user is the teacher of the course or an admin
            if (course.teacher_id.toString() !== req.user?.id && !req.admin) {
                await session.abortTransaction();
                session.endSession();
                return res.status(403).json({ message: 'Not authorized to delete this course' });
            }

            if (!course) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Course not found' });
            }

            // Delete the associated forum
            await Forum.findOneAndDelete({ course_id: course._id }, { session });

            // Delete the course
            await Course.findByIdAndDelete(course._id, { session });

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            res.json({ message: 'Course and associated forum deleted successfully' });
        } catch (error) {
            // If any error occurs, abort transaction
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error('Error in deleteCourse:', error);
        res.status(500).json({ message: 'Error deleting course' });
    }
}; 