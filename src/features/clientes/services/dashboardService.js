import axiosClient from '../../../api/axiosClient';

export async function obtenerResumen() {
  const { data } = await axiosClient.get('/dashboard/resumen');
  return data;
}
