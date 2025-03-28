import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProtectedRequest from '../../hooks/useProtectedRequest';
import authService from '../../services/AuthService';
import '../styles/Forum.css';

function Forum() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [forum, setForum] = useState(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const currentUserId = authService.getCurrentUser()?._id;

  // Initialize API requests
  const { makeRequest: getForum } = useProtectedRequest(`/api/v1/forums/${courseId}`, 'GET');
  const { makeRequest: createPost } = useProtectedRequest(`/api/v1/forums/${courseId}/posts`, 'POST');
  const { makeRequest: addComment } = useProtectedRequest(null, 'POST');
  const { makeRequest: togglePostLike } = useProtectedRequest(null, 'POST');
  const { makeRequest: toggleCommentLike } = useProtectedRequest(null, 'POST');

  // Fetch forum data
  useEffect(() => {
    const loadForum = async () => {
      try {
        const data = await getForum();
        setForum(data);
      } catch (error) {
        console.error('Error loading forum:', error);
      }
    };
    loadForum();
  }, [courseId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const data = await createPost(newPost);
      setForum(data);
      setNewPost({ title: '', content: '' });
      setIsNewPostModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!selectedPost) return;
    
    try {
      const data = await addComment(
        { content: newComment },
        `/api/v1/forums/${courseId}/posts/${selectedPost._id}/comments`
      );
      setForum(data);
      setNewComment('');
      
      // Update selected post to show new comment
      const updatedPost = data.posts.find(p => p._id === selectedPost._id);
      setSelectedPost(updatedPost);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const data = await togglePostLike(
        null,
        `/api/v1/forums/${courseId}/posts/${postId}/like`
      );
      setForum(data);
      if (selectedPost?._id === postId) {
        setSelectedPost(data.posts.find(p => p._id === postId));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const hasUserLikedPost = (post) => {
    return post.likes.some(like => like === currentUserId || like._id === currentUserId);
  };

  const hasUserLikedComment = (comment) => {
    return comment.likes.some(like => like === currentUserId || like._id === currentUserId);
  };

  const handleToggleCommentLike = async (postId, commentId) => {
    try {
      const data = await toggleCommentLike(
        null,
        `/api/v1/forums/${courseId}/posts/${postId}/comments/${commentId}/like`
      );
      setForum(data);
      if (selectedPost?._id === postId) {
        setSelectedPost(data.posts.find(p => p._id === postId));
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  if (!forum) {
    return <div className="loading">Loading forum...</div>;
  }

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h1>Course Forum</h1>
        <div className="forum-header-buttons">
          <button className="back-to-course-btn" onClick={() => navigate(`/student/courses/${courseId}`)}>
            <i className="fas fa-arrow-left"></i> Back to Course
          </button>
          <button className="new-post-btn" onClick={() => setIsNewPostModalOpen(true)}>
            <i className="fas fa-plus"></i> New Post
          </button>
        </div>
      </div>

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Post</h2>
              <button className="close-modal-btn" onClick={() => setIsNewPostModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Write your post content here..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsNewPostModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Create Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPost ? (
        <div className="post-details">
          <button className="back-btn" onClick={() => setSelectedPost(null)}>
            <i className="fas fa-arrow-left"></i> Back to Posts
          </button>
          <div className="post">
            <h2>{selectedPost.title}</h2>
            <p className="post-content">{selectedPost.content}</p>
            <div className="post-meta">
              <span className="author">By {selectedPost.author_id.email}</span>
              <button 
                className={`like-btn ${hasUserLikedPost(selectedPost) ? 'liked' : ''}`}
                onClick={() => handleToggleLike(selectedPost._id)}
              >
                <i className={`fas fa-heart ${hasUserLikedPost(selectedPost) ? 'liked' : ''}`}></i> {selectedPost.likes.length}
              </button>
            </div>
          </div>

          <div className="comments-section">
            <h3>Comments</h3>
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button type="submit">Post Comment</button>
            </form>
            <div className="comments-list">
              {selectedPost.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <p>{comment.content}</p>
                  <div className="comment-meta">
                    <span className="author">
                      {comment.author_id?.email || comment.author_id?.name || 'Anonymous'}
                    </span>
                    <button 
                      className={`like-btn ${hasUserLikedComment(comment) ? 'liked' : ''}`}
                      onClick={() => handleToggleCommentLike(selectedPost._id, comment._id)}
                      title={hasUserLikedComment(comment) ? 'Unlike' : 'Like'}
                    >
                      <i className={`fas fa-heart ${hasUserLikedComment(comment) ? 'liked' : ''}`}></i>
                      <span className="like-count">{comment.likes.length}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="posts-list">
          {forum?.posts.map((post) => (
            <div key={post._id} className="post-card">
              <div onClick={() => setSelectedPost(post)}>
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 150)}...</p>
              </div>
              <div className="post-meta">
                <span className="author">By {post.author_id.email}</span>
                <span className="stats">
                  <button 
                    className={`like-btn ${hasUserLikedPost(post) ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(post._id);
                    }}
                  >
                    <i className={`fas fa-heart ${hasUserLikedPost(post) ? 'liked' : ''}`}></i> {post.likes.length}
                  </button>
                  <span className="comments">
                    <i className="fas fa-comment"></i> {post.comments.length}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Forum; 