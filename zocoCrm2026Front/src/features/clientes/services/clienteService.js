import axiosClient from '../../../api/axiosClient';

const API_TO_FRONT_ESTADO = {
  0: 'Prospecto',
  1: 'Contactado',
  2: 'Interesado',
  3: 'No interesado',
  4: 'Cliente',
  'NoInteresado': 'No interesado',
};

const FRONT_TO_API_ESTADO = {
  'No interesado': 'NoInteresado',
};

function normalizeCliente(c) {
  if (!c) return c;
  const estadoStr = typeof c.estado === 'number'
    ? (API_TO_FRONT_ESTADO[c.estado] || 'Prospecto')
    : (API_TO_FRONT_ESTADO[c.estado] || c.estado);

  return {
    ...c,
    id: String(c.id),
    estado: estadoStr,
  };
}

export const clienteService = {
  async getClientes({ page = 1, pageSize = 5, search = '', estado = '', asesor = '' } = {}) {
    const params = { page, pageSize };
    if (search && search.trim()) params.search = search.trim();
    if (estado && estado.trim()) {
      const eTrim = estado.trim();
      params.estado = FRONT_TO_API_ESTADO[eTrim] || eTrim;
    }
    if (asesor && asesor.trim()) params.asesor = asesor.trim();

    const response = await axiosClient.get('/clientes', { params });
    const resData = response.data;
    if (Array.isArray(resData)) {
      const normalized = resData.map(normalizeCliente);
      return {
        items: normalized,
        totalItems: normalized.length,
        page,
        pageSize,
        totalPages: Math.ceil(normalized.length / pageSize),
      };
    }
    if (resData && resData.items) {
      return {
        ...resData,
        items: resData.items.map(normalizeCliente),
      };
    }
    return resData;
  },

  async getClienteById(id) {
    const response = await axiosClient.get(`/clientes/${id}`);
    return normalizeCliente(response.data);
  },

  async createCliente(clienteData) {
    const payload = {
      ...clienteData,
      estado: FRONT_TO_API_ESTADO[clienteData.estado] || clienteData.estado,
    };
    const response = await axiosClient.post('/clientes', payload);
    return normalizeCliente(response.data);
  },

  async updateCliente(id, patchData) {
    const payload = {
      ...patchData,
      estado: FRONT_TO_API_ESTADO[patchData.estado] || patchData.estado,
    };
    const response = await axiosClient.put(`/clientes/${id}`, payload);
    return normalizeCliente(response.data);
  },

  async deleteClientes(ids) {
    const list = Array.isArray(ids) ? ids : [ids];
    await Promise.all(list.map((id) => axiosClient.delete(`/clientes/${id}`)));
    return true;
  }
};
