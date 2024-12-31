import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import Input from '../common/Input';
import Button from '../common/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic
  };

  return (
    <div className="auth-container">
      <Logo />
      <div className="auth-content">
        <div className="auth-header">
          <h2>Login</h2>
          <Link to="/signup">Create an account</Link>
        </div>
        
        <Button 
          variant="google" 
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          
          <Button type="submit" variant="primary">
            Log in with email
          </Button>
        </form>

        <Link to="/forgot-password" className="forgot-password">
          I forgot my password
        </Link>
      </div>
    </div>
  );
};

export default Login; 