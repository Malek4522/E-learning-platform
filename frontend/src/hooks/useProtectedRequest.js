import { useState, useEffect } from 'react';
import authService from '../services/AuthService';
import axios from 'axios';

const useProtectedRequest = (url, method = 'GET', initialRequestData = null) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ type: null, message: null });

  const makeRequest = async (requestData = initialRequestData, overrideUrl = null) => {
    try {
      let token = authService.getAccessToken();
      
      if (!token) {
        const refreshResponse = await axios.post('/api/v1/auth/refresh-access', {}, {
          withCredentials: true
        });
        token = refreshResponse.data.accessToken;
        authService.setAccessToken(token);
      }

      const config = {
        method: method,
        url: overrideUrl || url,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };

      // Add data for POST, PUT, PATCH methods
      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && requestData) {
        config.data = requestData;
      }

      console.log('Making request with config:', {
        ...config,
        headers: { ...config.headers },
        data: config.data
      });

      const response = await axios(config);
      setData(response.data);
      setStatus({ type: 'success', message: 'Operation completed successfully!' });
      return response.data;

    } catch (error) {
      console.error('Request error:', error.response?.data || error);
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await axios.post('/api/v1/auth/refresh-access', {}, {
            withCredentials: true
          });
          authService.setAccessToken(refreshResponse.data.accessToken);
          return makeRequest(requestData, overrideUrl);
        } catch (refreshError) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
      }
      throw error;
    }
  };

  return { data, status, makeRequest };
};

export default useProtectedRequest; 