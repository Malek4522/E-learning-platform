const { body, param, cookie,validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { refreshSecret, options } = require('../config/jwt.config');

// Validation chains
const validations = {
  // Email validation
  email: body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .escape(),

  // Password validation with optional registration rules
  password: (isRegistration = false) => {
    const chain = body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .escape();

    // Add extra validation rules for registration and reset password
    if (isRegistration) {
      chain
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long');
    }

    return chain;
  },
  // First name validation
  first_name: body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s-']+$/)
    .withMessage('First name can only contain letters, spaces, hyphens and apostrophes')
    .escape(),

  // Last name validation  
  last_name: body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s-']+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens and apostrophes')
    .escape(),

  // Card number validation
  card_number: body('cardNumber')
    .trim()
    .notEmpty()
    .withMessage('Card number is required')
    .isLength({ min: 1, max: 20 })
    .withMessage('Card number must be exactly 8 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Card number can only contain uppercase letters and numbers')
    .escape(),
  // Reset token validation
  resetToken: param('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-fA-F0-9]+$/)
    .escape(),

  // Refresh token validation from cookie
  refreshTokenCookie: cookie('refreshToken')
    .trim()
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token format')
    .custom(async (value, { req }) => {
      try {
        // Verify the token structure and signature
        const decoded = jwt.verify(value, refreshSecret, options);
        
        // Check if token has required fields based on our token generation
        if (!decoded.id || !decoded.version === undefined) {
          throw new Error('Invalid token structure');
        }
        
        // Check if the decoded token corresponds to a user or admin
        const adminRoles = ['superadmin', 'contentmanager', 'moderator']; // Define valid admin roles
        if (adminRoles.includes(decoded.role)) {
          req.admin = decoded; // Store admin info
        } else {
          req.user = decoded; // Store user info
        }
        
        return true;
      } catch (error) {
        throw new Error('Invalid refresh token');
      }
    })
};

// Validation result handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Create validation middleware arrays
const validateLogin = [
  validations.email,
  validations.password(),
  handleValidation
];

const validateRegistration = [
  validations.email,
  validations.password(true),
  validations.first_name,
  validations.last_name,
  validations.card_number,
  handleValidation
];

const validateResetPassword = [
  validations.resetToken,
  validations.password(true),
  handleValidation
];

const validateForgotPassword = [
  validations.email,
  handleValidation
];

// Add refresh validation middleware
const validateRefresh = [
  validations.refreshTokenCookie,
  handleValidation
];

// Validation for Profile Update
const validateProfileUpdate = [
  body('first_name')
    .optional()
    .trim()
    .isString()
    .notEmpty()
    .withMessage('First name must be a non-empty string')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('last_name')
    .optional()
    .trim() 
    .isString()
    .notEmpty()
    .withMessage('Last name must be a non-empty string')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('bio')
    .optional()
    .trim()
    .isString()
    .withMessage('Bio must be a string')
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),

  body('profile_picture')
    .optional()
    .trim()
    .isURL()
    .withMessage('Profile picture must be a valid URL'),

  handleValidation
];


// Validation for Comment
const validateComment = (req, res, next) => {
  const { content , author_id} = req.body;

  // Validate content
  if (!content || typeof content !== 'string' || content.trim().length < 1) {
    return res
      .status(400)
      .json({ error: 'Comment content is required and must be a non-empty string.' });
  }
  if (content.length > 1000) { // Prevent excessively long input
    return res
      .status(400)
      .json({ error: 'Comment content must not exceed 1000 characters.' });
  }

  // Validate author_id (MongoDB ObjectID format)
  const objectIdPattern = /^[a-fA-F0-9]{24}$/;
  if (!author_id || typeof author_id !== 'string' || !objectIdPattern.test(author_id)) {
    return res.status(400).json({
      error: 'Valid MongoDB author ID is required. It must be a 24-character hexadecimal string.',
    });
  }

  // Security check for content (basic sanitization to prevent XSS)
  const sanitizedContent = content.replace(/<script.*?>.*?<\/script>/gi, '').trim();
  if (sanitizedContent !== content.trim()) {
    return res
      .status(400)
      .json({ error: 'Comment content contains potentially malicious input.' });
  }

  // Attach sanitized content to the request object
  req.body.content = sanitizedContent;
  next();
};


// Validation for Post
const validatePost = (req, res, next) => {
  const { author_id, content, title, image_url } = req.body;

  // Validate author_id (MongoDB ObjectID format)
  const objectIdPattern = /^[a-fA-F0-9]{24}$/;
  if (!author_id || typeof author_id !== 'string' || !objectIdPattern.test(author_id)) {
    return res.status(400).json({
      error: 'Valid MongoDB author ID is required. It must be a 24-character hexadecimal string.',
    });
  }

  // Validate title
  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    return res.status(400).json({
      error: 'Post title is required and must be at least 5 characters long.',
    });
  }
  if (title.length > 200) {
    return res.status(400).json({
      error: 'Post title must not exceed 200 characters.',
    });
  }

  // Security check for title (basic sanitization to prevent XSS)
  const sanitizedTitle = title.replace(/<script.*?>.*?<\/script>/gi, '').trim();
  if (sanitizedTitle !== title.trim()) {
    return res.status(400).json({
      error: 'Post title contains potentially malicious input.',
    });
  }

  // Validate content
  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    return res.status(400).json({
      error: 'Post content is required and must be at least 10 characters long.',
    });
  }
  if (content.length > 5000) {
    return res.status(400).json({
      error: 'Post content must not exceed 5000 characters.',
    });
  }

  // Security check for content (basic sanitization to prevent XSS)
  const sanitizedContent = content.replace(/<script.*?>.*?<\/script>/gi, '').trim();
  if (sanitizedContent !== content.trim()) {
    return res.status(400).json({
      error: 'Post content contains potentially malicious input.',
    });
  }

  // Validate image_url (optional)
  if (image_url) {
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i; // Basic URL validation
    if (typeof image_url !== 'string' || !urlPattern.test(image_url)) {
      return res.status(400).json({
        error: 'Image URL must be a valid URL if provided.',
      });
    }
  }

  // Attach sanitized fields to the request object
  req.body.title = sanitizedTitle;
  req.body.content = sanitizedContent;
  next();
};


// Export validation middlewares
module.exports = {
  validateLogin,
  validateRegistration,
  validateResetPassword,
  validateForgotPassword,
  validateRefresh,
  validateProfileUpdate,
  validateComment,
  validatePost
};