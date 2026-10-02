import axiosClient from '../../../api/axiosClient';

export const dashboardService = {
  async getResumen() {
    const response = await axiosClient.get('/dashboard/resumen');
    return response.data;
  },
};
