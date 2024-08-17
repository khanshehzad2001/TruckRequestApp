import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 20000,
});

export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
export const createOrder = (data, token) =>
  api.post('/orders', data, { headers: { Authorization: `Bearer ${token}` } });

export const getOrders = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };
  