const Progress = require('../models/Progress');
const Course = require('../models/Course');

// Create or update progress
exports.updateProgress = async (req, res) => {
    try {
        const { courseId, chapterId, lessonId, contentCompleted, quizScore } = req.body;

        // First verify that the chapter and lesson exist in the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const chapter = course.chapters.find(ch => ch._id.toString() === chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const lesson = chapter.lessons.find(l => l._id.toString() === lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

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
                if (quizScore >= 0 && quizScore <= 100) {
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
        let progress = await Progress.findOne({
            user_id: req.user.id,
            course_id: req.params.courseId
        });

        if (!progress) {
            progress = new Progress({
                user_id: req.user.id,
                course_id: req.params.courseId,
                lessons_completed: []
            });
            await progress.save();
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
        const allProgress = await Progress.find({
            user_id: req.user.id
        }).populate({
            path: 'course_id',
            select: 'title chapters'
        });

        const formattedProgress = await Promise.all(allProgress.map(async progress => {
            // Get the full course data to ensure we have all chapter and lesson details
            const fullCourse = await Course.findById(progress.course_id._id);
            
            return {
                course_id: progress.course_id._id,
                course_title: progress.course_id.title,
                lessons_completed: progress.lessons_completed.map(lesson => {
                    // Find the chapter that contains this lesson
                    const chapter = fullCourse.chapters.find(ch => {
                        return ch.lessons.some(l => l._id.toString() === lesson.lesson_id.toString());
                    });

                    if (!chapter) {
                        console.log('Chapter not found for lesson:', lesson.lesson_id);
                        return {
                            lesson_id: lesson.lesson_id,
                            lesson_name: 'Unknown Lesson',
                            chapter_title: 'Unknown Chapter',
                            quiz_score: lesson.quiz_score,
                            content_completed: lesson.content_completed
                        };
                    }

                    // Find the lesson in the chapter
                    const lessonData = chapter.lessons.find(
                        l => l._id.toString() === lesson.lesson_id.toString()
                    );

                    return {
                        lesson_id: lesson.lesson_id,
                        lesson_name: lessonData?.title || 'Unknown Lesson',
                        chapter_title: chapter.chapter_title,
                        quiz_score: lesson.quiz_score,
                        content_completed: lesson.content_completed
                    };
                })
            };
        }));

        res.json(formattedProgress);
    } catch (error) {
        console.error('Error in getAllProgress:', error);
        res.status(500).json({ message: 'Error fetching all progress' });
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