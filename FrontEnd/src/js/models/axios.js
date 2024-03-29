import axios from 'axios';
import { BACKEND_URL, FETCH_API_TIMEOUT } from '../config';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  timeout: FETCH_API_TIMEOUT * 1000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('ytk_jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    const token = response.data.token;
    if (token) localStorage.setItem('ytk_jwt', token);

    return response;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
