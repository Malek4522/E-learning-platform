const Progress = require('../models/Progress');
const Course = require('../models/Course');

// Create or update progress
exports.updateProgress = async (req, res) => {
    try {
        const { courseId, chapterId, lessonId, contentCompleted, quizScore } = req.body;

        let progress = await Progress.findOne({
            user_id: req.user.id,
            course_id: courseId
        });

        if (!progress) {
            progress = new Progress({
                user_id: req.user.id,
                course_id: courseId,
                lessons_completed: []
            });
        }

        // Find existing lesson completion using IDs
        const existingLessonIndex = progress.lessons_completed.findIndex(
            lesson => lesson.chapter_id.toString() === chapterId && 
                     lesson.lesson_id.toString() === lessonId
        );

        if (existingLessonIndex > -1) {
            // Update existing lesson completion
            if (contentCompleted !== undefined) {
                progress.lessons_completed[existingLessonIndex].content_completed = contentCompleted;
            }
            if (quizScore !== undefined) {
                if (quizScore >= 0 && quizScore <= 100 ) {
                    progress.lessons_completed[existingLessonIndex].quiz_score = quizScore;
                } else {
                    return res.status(400).json({ message: 'Quiz score must be between 0 and 100' });
                }
            }
        } else {
            // Add new lesson completion
            progress.lessons_completed.push({
                chapter_id: chapterId,
                lesson_id: lessonId,
                content_completed: contentCompleted || false,
                quiz_score: quizScore || 0
            });
        }

        await progress.save();
        res.json(progress);
    } catch (error) {
        console.error('Error in updateProgress:', error);
        res.status(500).json({ message: 'Error updating progress' });
    }
};

// Get user's progress for a course
exports.getProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            user_id: req.user.id,
            course_id: req.params.courseId
        });

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        res.json(progress);
    } catch (error) {
        console.error('Error in getProgress:', error);
        res.status(500).json({ message: 'Error fetching progress' });
    }
};

// Get all progress for a user
exports.getAllProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ user_id: req.user.id })
            .populate('course_id', 'title description')
        res.json(progress);
    } catch (error) {
        console.error('Error in getAllProgress:', error);
        res.status(500).json({ message: 'Error fetching progress' });
    }
};

// Reset progress for a course
exports.resetProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            user_id: req.user.id,
            course_id: req.params.courseId
        });

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        progress.lessons_completed = [];
        progress.percentage_completed = 0;
        
        await progress.save();
        res.json({ message: 'Progress reset successfully' });
    } catch (error) {
        console.error('Error in resetProgress:', error);
        res.status(500).json({ message: 'Error resetting progress' });
    }
}; 