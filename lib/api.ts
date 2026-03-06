import axios from 'axios';
import { getClerkAuth } from './clerk-token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '/api',
});

api.interceptors.request.use(async (config) => {
  try {
    const { token, userId } = await getClerkAuth();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      config.headers['clerkId'] = userId;
    }
  } catch (error) {
    console.error('Error fetching Clerk token:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Automatically unwrap the 'data' property from our standard response format
    if (response.data && response.data.status === 'success' && 'data' in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized (401) - Please ensure you are logged in and synced.');
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const hasClerkUser = Boolean(window.Clerk?.user?.id);
        if (hasClerkUser) {
          return Promise.reject(error);
        }
        if (path.startsWith('/auth')) {
          return Promise.reject(error);
        }
        window.location.href = '/auth/login';
      }
    } else if (error.response?.status === 403) {
      console.error('Forbidden (403)');
    }
    return Promise.reject(error);
  },
);

export default api;
