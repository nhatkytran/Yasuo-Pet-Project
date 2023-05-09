import axios from 'axios';
import { BACKEND_URL, FETCH_API_TIMEOUT } from '../config';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: FETCH_API_TIMEOUT * 1000,
});

export default axiosInstance;
