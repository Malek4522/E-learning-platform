import { useState, useEffect } from 'react';
import authService from '../services/AuthService';
import axios from 'axios';

const useProtectedRequest = (url, method = 'GET', initialRequestData = null) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ type: null, message: null });

  const makeRequest = async (requestData = initialRequestData) => {
    const token = authService.getAccessToken();
    if (!token) {
      try {
        const refreshResponse = await axios.post('/api/v1/auth/refresh', {}, {
          withCredentials: true
        });
        authService.setAccessToken(refreshResponse.data.accessToken);
      } catch (error) {
        window.location.href = '/login';
        return;
      }
    }

    try {
      const config = {
        method: method,
        url: url,
        headers: {
          Authorization: `Bearer ${token}`
        },
      };

      if (requestData) {
        config.data = requestData;
      }

      const response = await axios(config);
      setData(response.data);
      setStatus({ type: 'success', message: 'Operation completed successfully!' });
      return response.data;

    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await axios.post('/api/v1/auth/refresh', {}, {
            withCredentials: true
          });
          
          authService.setAccessToken(refreshResponse.data.accessToken);
          return makeRequest(requestData); // Retry request with same data
        } catch (refreshError) {
          setStatus({ type: 'error', message: 'Session expired. Please log in again.' });
          window.location.href = '/login';
          return;
        }
      }

      setStatus({ 
        type: 'error', 
        message: 'Error making request: ' + (error.response?.data?.message || error.message)
      });
      throw error;
    }
  };

  return { data, status, makeRequest };
};

export default useProtectedRequest; 