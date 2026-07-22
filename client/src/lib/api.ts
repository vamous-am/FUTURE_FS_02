import axios from 'axios';
import { authRef } from './authRef.js';

/**
 * Axios instance for all API requests.
 * Sends credentials (httpOnly cookie) on every request.
 * Calls authRef.logout() on any 401 response and re-rejects the error.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authRef.logout();
    }
    return Promise.reject(error);
  },
);

export default api;
