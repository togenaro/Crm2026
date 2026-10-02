import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo global de errores si es necesario
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamiento de errores de red o backend
    return Promise.reject(error);
  }
);

export default axiosClient;
