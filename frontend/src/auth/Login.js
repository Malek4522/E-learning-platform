import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../landing/components/Navbar';
import styles from './Login.module.css';
import axios from 'axios';
import authService from '../services/AuthService';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password
      });

      if (response.status === 200) {
        // Store the token in memory
        authService.setAccessToken(response.data.accessToken);        

        // Redirect based on role
        let role = authService.getRole();
        
        navigate(`/${role}`);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        console.error('An error occurred during login:', err);
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }

      

      
  };

  return (
    <>
      <Navbar />
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <h1>Login</h1>
          {error && (
            <div className={styles.errorMessage} data-testid="error-message">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;