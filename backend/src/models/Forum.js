const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Comment Schema
const commentSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: false
  }
});

// Method to like/unlike a comment
commentSchema.methods.toggleLike = async function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(id => id.toString() === userIdStr);
  
  if (likeIndex === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(likeIndex, 1);
  }

  // Get the parent forum document and save it
  const forum = this.ownerDocument();
  return forum.save();
};


// Post Schema
const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Post title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: [5000, 'Post content cannot be more than 5000 characters']
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  image_url: {
    type: String,
    trim: true
  },
  comments: [commentSchema]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: false
  }
});

// Method to like/unlike a post
postSchema.methods.toggleLike = async function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(id => id.toString() === userIdStr);
  
  if (likeIndex === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(likeIndex, 1);
  }

  // Get the parent forum document and save it
  const forum = this.ownerDocument();
  return forum.save();
};


// Forum Schema
const forumSchema = new Schema({
  course_id: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  posts: [postSchema]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Create indexes
forumSchema.index({ course_id: 1 });
forumSchema.index({ 'posts.author_id': 1 });
forumSchema.index({ 'posts.comments.author_id': 1 });
forumSchema.index({ 'posts.title': 'text', 'posts.content': 'text' }); // For text search

// Methods
forumSchema.methods.createPost = async function(authorId, title, content, imageUrl = null) {
  const post = {
    title,
    content,
    author_id: authorId
  };

  if (imageUrl) {
    post.image_url = imageUrl;
  }

  this.posts.push(post);
  return this.save();
};

forumSchema.methods.addComment = async function(postId, authorId, content) {
  const post = this.posts.id(postId);
  if (!post) {
    throw new Error('Post not found-comment');
  }

  post.comments.push({
    content,
    author_id: authorId
  });
  
  return this.save();
};

// Static method to find forum by course
forumSchema.statics.findByCourse = function(courseId) {
  return this.findOne({ course_id: courseId })
    .populate('posts.author_id', 'email role profile')
    .populate('posts.comments.author_id', 'email role profile');
};

// Create and export the model
const Forum = mongoose.model('Forum', forumSchema);
module.exports = Forum; 