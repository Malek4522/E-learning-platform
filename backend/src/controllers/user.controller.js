const User = require('../models/User');
const Course = require('../models/Course');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -resetPasswordToken -resetPasswordExpires -refreshTokens -tokenVersion');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const allowedUpdates = {
            'profile.first_name': req.body.first_name,
            'profile.last_name': req.body.last_name,
            'profile.bio': req.body.bio,
            'profile.profile_picture': req.body.profile_picture
        };

        // Remove undefined values
        Object.keys(allowedUpdates).forEach(key => 
            allowedUpdates[key] === undefined && delete allowedUpdates[key]
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: allowedUpdates },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires -refreshTokens -tokenVersion');

        res.json(user);
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

// Get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const courses = await Course.find({ students_enrolled: req.user.id })
            .populate('teacher_id', 'email profile')
            .select('-key -students_enrolled -chapters.lessons.quiz.questions.correct_answer_index');
        res.json(courses);
    } catch (error) {
        console.error('Error in getEnrolledCourses:', error);
        res.status(500).json({ message: 'Error fetching enrolled courses' });
    }
};

// Enroll in a course
exports.enrollCourse_key = async (req, res) => {
    try {
        const course = await Course.findOne({ key: req.params.key});
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.students_enrolled.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        course.students_enrolled.push(req.user.id);
        await course.save();

        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        console.error('Error in enrollCourse:', error);
        res.status(500).json({ message: 'Error enrolling in course' });
    }
}; 