const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/', forumController.createForum);
router.get('/:courseId', forumController.getForumByCourse);
router.post('/:courseId/posts', forumController.createPost);
router.post('/:courseId/posts/:postId/comments', forumController.addComment);
router.post('/:courseId/posts/:postId/like', forumController.togglePostLike);
router.post('/:courseId/posts/:postId/comments/:commentId/like', forumController.toggleCommentLike);

module.exports = router; 