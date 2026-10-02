import axiosClient from '../../../api/axiosClient';

export const USUARIOS = [
  { usuario: 'carlos', nombre: 'Carlos Vega' },
  { usuario: 'laura', nombre: 'Laura Gómez' },
  { usuario: 'martin', nombre: 'Martín Ruiz' },
];

export async function loginAsesor(credentials) {
  const response = await axiosClient.post('/asesores/login', credentials);
  return response.data;
}
