import { useState, useEffect } from 'react';
import authService from '../services/AuthService';

const useProtectedFetch = (url) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ type: null, message: null });

  const fetchData = async () => {
    const token = authService.getAccessToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const reqHeaders = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { headers: reqHeaders });

      if (response.status === 401) {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const newToken = await refreshResponse.json();
          authService.setAccessToken(newToken.accessToken);
          return fetchData(); // Retry fetching data
        } else {
          setStatus({ type: 'error', message: 'Session expired. Please log in again.' });
          return;
        }
      }

      const data = await response.json();

      if (response.ok) {
        setData(data);
        setStatus({ type: 'success', message: 'Data fetched successfully!' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to fetch data' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error fetching data: ' + error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, status };
};

export default useProtectedFetch; 