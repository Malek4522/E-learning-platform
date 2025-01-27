import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProtectedRequest from '../../hooks/useProtectedRequest';
import '../styles/Forum.css';

// Temporary static data
const STATIC_FORUM_DATA = {
  posts: [
    {
      _id: '1',
      title: 'Help with JavaScript Promises',
      content: 'I\'m having trouble understanding how Promises work in JavaScript. Can someone explain the difference between .then() and async/await? I\'ve been trying to implement a simple API call but keep getting stuck.',
      author_id: {
        _id: 'user1',
        email: 'john.doe@example.com',
        profile: {
          name: 'John Doe'
        }
      },
      likes: ['user2', 'user3'],
      image_url: 'https://miro.medium.com/max/1400/1*6IyqY8qKG_HEh6JCeVS3HA.png',
      comments: [
        {
          _id: 'c1',
          content: 'Async/await is just syntactic sugar over promises. It makes asynchronous code look more synchronous and easier to read.',
          author_id: {
            _id: 'user2',
            email: 'jane.smith@example.com',
            profile: {
              name: 'Jane Smith'
            }
          },
          likes: ['user1'],
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          _id: 'c2',
          content: 'Here\'s a simple example:\n\nasync function getData() {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}',
          author_id: {
            _id: 'user3',
            email: 'bob.wilson@example.com',
            profile: {
              name: 'Bob Wilson'
            }
          },
          likes: ['user1', 'user2'],
          created_at: '2024-01-15T11:15:00Z'
        }
      ],
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      _id: '2',
      title: 'Best Resources for Learning React',
      content: 'I\'m new to React and looking for the best resources to learn. What courses, tutorials, or documentation would you recommend for a beginner? I have some experience with HTML, CSS, and basic JavaScript.',
      author_id: {
        _id: 'user4',
        email: 'sarah.jones@example.com',
        profile: {
          name: 'Sarah Jones'
        }
      },
      likes: ['user1', 'user2', 'user3', 'user5'],
      comments: [
        {
          _id: 'c3',
          content: 'The official React documentation is actually really good! They recently updated it with a new tutorial system.',
          author_id: {
            _id: 'user5',
            email: 'mike.brown@example.com',
            profile: {
              name: 'Mike Brown'
            }
          },
          likes: ['user4'],
          created_at: '2024-01-16T09:20:00Z'
        }
      ],
      created_at: '2024-01-16T09:00:00Z'
    },
    {
      _id: '3',
      title: 'Weekly Study Group - Who\'s Interested?',
      content: 'I\'m thinking of starting a weekly study group where we can practice coding together, share knowledge, and work on small projects. Would anyone be interested in joining? We could meet virtually every Wednesday at 7 PM.',
      author_id: {
        _id: 'user2',
        email: 'jane.smith@example.com',
        profile: {
          name: 'Jane Smith'
        }
      },
      likes: ['user1', 'user3', 'user4', 'user5'],
      comments: [],
      created_at: '2024-01-17T15:45:00Z'
    }
  ]
};

function Forum() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [forum, setForum] = useState(STATIC_FORUM_DATA); // Using static data

  const handleCreatePost = async (e) => {
    e.preventDefault();
    // Simulate post creation with static data
    const newStaticPost = {
      _id: Date.now().toString(),
      ...newPost,
      author_id: {
        _id: 'current_user',
        email: 'current.user@example.com',
        profile: {
          name: 'Current User'
        }
      },
      likes: [],
      comments: [],
      created_at: new Date().toISOString()
    };

    setForum(prev => ({
      ...prev,
      posts: [newStaticPost, ...prev.posts]
    }));
    setNewPost({ title: '', content: '', image_url: '' });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!selectedPost) return;
    
    // Simulate comment creation with static data
    const newStaticComment = {
      _id: Date.now().toString(),
      content: newComment,
      author_id: {
        _id: 'current_user',
        email: 'current.user@example.com',
        profile: {
          name: 'Current User'
        }
      },
      likes: [],
      created_at: new Date().toISOString()
    };

    const updatedPosts = forum.posts.map(post => {
      if (post._id === selectedPost._id) {
        return {
          ...post,
          comments: [...post.comments, newStaticComment]
        };
      }
      return post;
    });

    setForum(prev => ({ ...prev, posts: updatedPosts }));
    setNewComment('');
    
    // Update selected post to show new comment
    setSelectedPost(updatedPosts.find(p => p._id === selectedPost._id));
  };

  const handleToggleLike = async (postId) => {
    const updatedPosts = forum.posts.map(post => {
      if (post._id === postId) {
        const hasLiked = post.likes.includes('current_user');
        return {
          ...post,
          likes: hasLiked 
            ? post.likes.filter(id => id !== 'current_user')
            : [...post.likes, 'current_user']
        };
      }
      return post;
    });

    setForum(prev => ({ ...prev, posts: updatedPosts }));
    if (selectedPost?._id === postId) {
      setSelectedPost(updatedPosts.find(p => p._id === postId));
    }
  };

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h1>Course Forum</h1>
        <div className="forum-header-buttons">
          <button className="back-to-course-btn" onClick={() => navigate(`/student/courses/${courseId}`)}>
            <i className="fas fa-arrow-left"></i> Back to Course
          </button>
          <button className="new-post-btn" onClick={() => setSelectedPost(null)}>
            <i className="fas fa-plus"></i> New Post
          </button>
        </div>
      </div>

      {!selectedPost ? (
        <div className="new-post-form">
          <h2>Create New Post</h2>
          <form onSubmit={handleCreatePost}>
            <input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Post Content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newPost.image_url}
              onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
            />
            <button type="submit">Create Post</button>
          </form>
        </div>
      ) : (
        <div className="post-details">
          <button className="back-btn" onClick={() => setSelectedPost(null)}>
            <i className="fas fa-arrow-left"></i> Back to Posts
          </button>
          <div className="post">
            <h2>{selectedPost.title}</h2>
            <p className="post-content">{selectedPost.content}</p>
            {selectedPost.image_url && (
              <img src={selectedPost.image_url} alt="Post" className="post-image" />
            )}
            <div className="post-meta">
              <span className="author">By {selectedPost.author_id.email}</span>
              <button 
                className={`like-btn ${selectedPost.likes.includes('current_user') ? 'liked' : ''}`}
                onClick={() => handleToggleLike(selectedPost._id)}
              >
                <i className="fas fa-heart"></i> {selectedPost.likes.length}
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
                    <span className="author">{comment.author_id.email}</span>
                    <span className="likes">
                      <i className="fas fa-heart"></i> {comment.likes.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedPost && forum?.posts && (
        <div className="posts-list">
          {forum.posts.map((post) => (
            <div key={post._id} className="post-card" onClick={() => setSelectedPost(post)}>
              <h3>{post.title}</h3>
              <p>{post.content.substring(0, 150)}...</p>
              <div className="post-meta">
                <span className="author">By {post.author_id.email}</span>
                <span className="stats">
                  <span className="likes">
                    <i className="fas fa-heart"></i> {post.likes.length}
                  </span>
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