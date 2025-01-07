import { useState } from 'react';
import authService from '../services/AuthService';
import axios from 'axios';

const useLogout = () => {
  const [status, setStatus] = useState({ type: null, message: null });

  const logout = async () => {
    try {
      const response = await axios.post('/api/v1/auth/logout', {}, {
        withCredentials: true
      });

      if (response.status === 200) {
        authService.setAccessToken(null); // Clear the access token
        setStatus({ type: 'success', message: 'Logged out successfully!' });
      } else {
        setStatus({ type: 'error', message: response.data.message || 'Logout failed' });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Error during logout: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  return { logout, status };
};

export default useLogout; 