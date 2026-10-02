import axiosClient from '../../../api/axiosClient';

export const asesorService = {
  async getAsesores() {
    const response = await axiosClient.get('/asesores');
    return response.data;
  },
};
