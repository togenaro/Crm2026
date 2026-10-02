import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    const body = error.response?.data;
    const message = body?.error
      || body?.errores?.join(' ')
      || Object.values(body?.errors ?? {}).flat().join(' ')
      || (error.response
        ? `La solicitud falló (${error.response.status}).`
        : 'No se pudo conectar con el servidor. Verificá que el backend esté iniciado.');

    return Promise.reject(new Error(message));
  },
);

export default axiosClient;
