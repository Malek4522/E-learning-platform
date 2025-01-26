import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../landing/components/Navbar';
import styles from './SignUp.module.css'; // Import the CSS module
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    firstName: '',
    lastName: '',
    year: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      try {
        const response = await axios.post('/api/v1/auth/register', formData);
        
        if (response.status === 201) {
          // Registration successful
          navigate('/login');
        }
      } catch (error) {
        if (error.response?.status === 400) {
          alert('Email already exists. Please use a different email address.');
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.signUpWrapper}>
        <div className={styles.signUpContainer}>
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Card Number</label>
              <input 
                type="text" 
                id="cardNumber" 
                name="cardNumber"
                placeholder="Enter your card number"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="year">Year</label>
              <input 
                type="text" 
                id="year" 
                name="year"
                placeholder="Enter your year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>Sign Up</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;