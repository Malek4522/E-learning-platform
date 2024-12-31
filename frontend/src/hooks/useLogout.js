import { useState } from 'react';
import authService from '../services/AuthService';

const useLogout = () => {
  const [status, setStatus] = useState({ type: null, message: null });

  const logout = async () => {
    try {
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        authService.setAccessToken(null); // Clear the access token
        setStatus({ type: 'success', message: 'Logged out successfully!' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Logout failed' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error during logout: ' + error.message });
    }
  };

  return { logout, status };
};

export default useLogout; 