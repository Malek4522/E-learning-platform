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

// Get enrolled courses(not in use)
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

// Get all enrolled students across teacher's courses with course details
exports.getEnrolledStudents = async (req, res) => {
    try {
        // Get all courses where current user is the teacher
        const teacherCourses = await Course.find({ teacher_id: req.user.id })
            .select('title students_enrolled');

        if (!teacherCourses.length) {
            return res.json([]);
        }

        // Get all enrolled students across all courses
        const enrollmentDetails = [];
        
        for (const course of teacherCourses) {
            // Get student details for this course
            const students = await User.find({
                _id: { $in: course.students_enrolled }
            }).select('_id email profile');

            // Add each student's enrollment details
            students.forEach(student => {
                enrollmentDetails.push({
                    studentId: student._id,
                    name: `${student.profile.first_name} ${student.profile.last_name}`,
                    courseName: course.title,
                    courseId: course._id,
                    joiningDate: student._id.getTimestamp(), // Using _id timestamp as enrollment date
                    email: student.email
                });
            });
        }

        // Sort by most recent enrollments first
        enrollmentDetails.sort((a, b) => b.joiningDate - a.joiningDate);

        res.json(enrollmentDetails);
    } catch (error) {
        console.error('Error in getEnrolledStudents:', error);
        res.status(500).json({ message: 'Error fetching enrolled students' });
    }
};
// Remove student from course
exports.removeStudentFromCourse = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;

        // Find the course
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the teacher of the course
        if (course.teacher_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to remove students from this course' });
        }

        // Check if student is enrolled
        if (!course.students_enrolled.includes(studentId)) {
            return res.status(400).json({ message: 'Student is not enrolled in this course' });
        }

        // Remove student from course
        course.students_enrolled = course.students_enrolled.filter(
            id => id.toString() !== studentId
        );
        
        await course.save();

        res.json({ message: 'Student successfully removed from course' });
    } catch (error) {
        console.error('Error in removeStudentFromCourse:', error);
        res.status(500).json({ message: 'Error removing student from course' });
    }
};

exports.getDashboard = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("Fetching for user:", userId);
  
      // Find courses where the user is enrolled
      const courses = await Course.find({
        students_enrolled: userId,
      }).select("_id title chapters.chapter_title chapters.lessons");
  
      console.log("Found courses:", courses.length);
  
      const allLessons = [];
  
      courses.forEach((course) => {
        course.chapters.forEach((chapter) => {
          if (chapter.lessons && chapter.lessons.length > 0) {
            chapter.lessons.forEach((lesson) => {
              allLessons.push({
                _id: lesson._id,
                course_id: course._id,
                course_title: course.title,
                chapter_title: chapter.chapter_title,
                lesson_title: lesson.title,
                duration: lesson.content?.video?.duration || 0,
                addedTime: lesson.createdAt || new Date(),
              });
            });
          }
        });
      });
  
      console.log("Total lessons found:", allLessons.length);
  
      // Sort by lesson createdAt timestamp and get latest 5
      const recentLessons = allLessons
        .sort((a, b) => new Date(b.addedTime) - new Date(a.addedTime))
        .slice(0, 5);
  
      console.log("Recent lessons:", recentLessons);
  
      res.status(200).json({
        success: true,
        newLessons: recentLessons,
        totalLessons: recentLessons.length,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching dashboard data",
        error: error.message,
      });
    }
  };




