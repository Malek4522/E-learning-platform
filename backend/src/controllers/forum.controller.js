const Forum = require('../models/Forum');

// Create new forum
exports.createForum = async (req, res) => {
    try {
        const forum = new Forum({
            course_id: req.body.course_id
        });

        await forum.save();
        res.status(201).json(forum);
    } catch (error) {
        console.error('Error in createForum:', error);
        res.status(500).json({ message: 'Error creating forum' });
    }
};

// Get forum by course
exports.getForumByCourse = async (req, res) => {
    try {
        const forum = await Forum.findByCourse(req.params.courseId);
        
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }
        
        res.json(forum);
    } catch (error) {
        console.error('Error in getForumByCourse:', error);
        res.status(500).json({ message: 'Error fetching forum' });
    }
};

// Create post
exports.createPost = async (req, res) => {
    try {
        const forum = await Forum.findOne({ course_id: req.params.courseId });
        
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        await forum.createPost(
            req.user.id,
            req.body.title,
            req.body.content,
            req.body.image_url
        );

        res.status(201).json(forum);
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

// Add comment to post
exports.addComment = async (req, res) => {
    try {
        const forum = await Forum.findOne({ course_id: req.params.courseId });
        
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        await forum.addComment(
            req.params.postId,
            req.user.id,
            req.body.content
        );

        res.status(201).json(forum);
    } catch (error) {
        console.error('Error in addComment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
};

// Toggle like on post
exports.togglePostLike = async (req, res) => {
    try {
        const forum = await Forum.findOne({ course_id: req.params.courseId });
        
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        const post = forum.posts.id(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.toggleLike(req.user.id);
        res.json(forum);
    } catch (error) {
        console.error('Error in togglePostLike:', error);
        res.status(500).json({ message: 'Error toggling like' });
    }
};

// Toggle like on comment
exports.toggleCommentLike = async (req, res) => {
    try {
        const forum = await Forum.findOne({ course_id: req.params.courseId });
        
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        const post = forum.posts.id(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await comment.toggleLike(req.user.id);
        res.json(forum);
    } catch (error) {
        console.error('Error in toggleCommentLike:', error);
        res.status(500).json({ message: 'Error toggling comment like' });
    }
}; 
