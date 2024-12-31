import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import Input from '../common/Input';
import Button from '../common/Button';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    experience: '',
    subjects: '',
    teachingMethodology: '',
    skills: '',
    video: null,
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
  };

  return (
    <div className="auth-container">
      <Logo />
      <div className="auth-content">
        <h2>Sign Up</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>

          {/* Add all other input fields similarly */}
          
          <div className="video-upload">
            <p>Maximum size is 10MB (mp4)</p>
            <input
              type="file"
              accept="video/mp4"
              onChange={handleChange}
              name="video"
            />
            {errors.video && (
              <span className="error-message">{errors.video}</span>
            )}
          </div>

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" variant="primary">
            Sign up with email
          </Button>
        </form>

        <Link to="/login" className="login-link">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp; 