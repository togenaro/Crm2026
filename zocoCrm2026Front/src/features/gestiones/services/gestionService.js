import axiosClient from '../../../api/axiosClient';

const TIPO_MAP = {
  0: 'Llamada',
  1: 'WhatsApp',
  2: 'Correo',
  3: 'Reunión',
  4: 'Otro',
  Reunion: 'Reunión',
};

const ESTADO_MAP = {
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

function fechaGestionParaApi(gestionData) {
  if (!gestionData.fechaGestionIso) return null;

  const fechaLocal = new Date(gestionData.fechaGestionIso);
  return Number.isNaN(fechaLocal.getTime())
    ? gestionData.fechaGestionIso
    : fechaLocal.toISOString();
}

function proximoContactoParaApi(fecha) {
  if (!fecha) return null;
  return fecha.includes('T') ? fecha : `${fecha}T12:00:00`;
}

function normalizeGestion(g) {
  if (!g) return g;
  const tipoStr = TIPO_MAP[g.tipoContacto] || g.tipoContacto || 'Llamada';

  const estadoStr = typeof g.estadoResultante === 'number'
    ? (ESTADO_MAP[g.estadoResultante] || 'Prospecto')
    : (ESTADO_MAP[g.estadoResultante] || g.estadoResultante);

  return {
    ...g,
    id: String(g.id),
    clienteId: String(g.clienteId),
    tipoContacto: tipoStr,
    estadoResultante: estadoStr,
  };
}

export const gestionService = {
  async getGestiones(params = {}) {
    const response = await axiosClient.get('/gestiones', { params });
    const resData = response.data;
    if (Array.isArray(resData)) {
      const normalized = resData.map(normalizeGestion);
      return {
        items: normalized,
        totalItems: normalized.length,
        page: params.page || 1,
        pageSize: params.pageSize || 5,
        totalPages: Math.ceil(normalized.length / (params.pageSize || 5)),
      };
    }
    return {
      ...resData,
      items: (resData?.items || []).map(normalizeGestion),
      asesores: resData?.asesores || [],
    };
  },

  async getGestionesByCliente(clienteId, params = {}) {
    const response = await axiosClient.get(`/clientes/${clienteId}/gestiones`, { params });
    const resData = response.data;
    if (Array.isArray(resData)) {
      const normalized = resData.map(normalizeGestion);
      return {
        items: normalized,
        totalItems: normalized.length,
        page: params.page || 1,
        pageSize: params.pageSize || 5,
        totalPages: Math.ceil(normalized.length / (params.pageSize || 5)),
      };
    }
    if (resData && resData.items) {
      return {
        ...resData,
        items: resData.items.map(normalizeGestion),
      };
    }
    return resData;
  },

  async addGestion(clienteId, gestionData, nuevoEstado, nuevoProximoContacto, asesor) {
    const payload = {
      tipoContacto: gestionData.tipoContacto,
      comentario: gestionData.comentario,
      estadoResultante: FRONT_TO_API_ESTADO[nuevoEstado] || nuevoEstado,
      proximoContacto: proximoContactoParaApi(nuevoProximoContacto),
      fechaGestion: fechaGestionParaApi(gestionData),
      asesor,
    };
    const response = await axiosClient.post(`/clientes/${clienteId}/gestiones`, payload);
    return normalizeGestion(response.data);
  },

  async updateGestion(clienteId, gestionId, gestionData, nuevoEstado, nuevoProximoContacto) {
    const payload = {
      tipoContacto: gestionData.tipoContacto,
      comentario: gestionData.comentario,
      estadoResultante: FRONT_TO_API_ESTADO[nuevoEstado] || nuevoEstado,
      proximoContacto: proximoContactoParaApi(nuevoProximoContacto),
      fechaGestion: fechaGestionParaApi(gestionData),
    };
    const response = await axiosClient.put(`/clientes/${clienteId}/gestiones/${gestionId}`, payload);
    return normalizeGestion(response.data);
  }
};
