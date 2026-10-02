import axiosClient from '../../../api/axiosClient';

function formatoEstado(estado) {
  return estado === 'NoInteresado' ? 'No interesado' : estado;
}

function fechaCorta(fecha) {
  return fecha ? fecha.slice(0, 10) : '';
}

function clienteDesdeApi(cliente) {
  const proximoContacto = fechaCorta(cliente.proximoContacto);
  return {
    ...cliente,
    estado: formatoEstado(cliente.estado),
    proximoContacto,
    fechaCreacion: fechaCorta(cliente.fechaCreacion),
    fechaActualizacion: fechaCorta(cliente.fechaActualizacion),
    vencido: Boolean(proximoContacto && proximoContacto < new Date().toISOString().slice(0, 10)),
  };
}

function estadoParaApi(estado) {
  return estado === 'No interesado' ? 'NoInteresado' : estado;
}

function clienteParaApi(datos) {
  return {
    nombre: datos.nombre,
    cuit: datos.cuit,
    telefono: datos.telefono || null,
    email: datos.email || null,
    estado: estadoParaApi(datos.estado),
    asesor: datos.asesor || null,
  };
}

export async function listarClientes() {
  const { data: resultado } = await axiosClient.get('/clientes', {
    params: { page: 1, pageSize: 1000 },
  });
  return resultado.items.map(clienteDesdeApi);
}

export async function obtenerCliente(id) {
  const { data: cliente } = await axiosClient.get(`/clientes/${id}`);
  return clienteDesdeApi(cliente);
}

export async function crearCliente(datos) {
  const { data: cliente } = await axiosClient.post('/clientes', clienteParaApi(datos));
  return clienteDesdeApi(cliente);
}

export async function actualizarCliente(id, datos) {
  const { data: cliente } = await axiosClient.put(`/clientes/${id}`, clienteParaApi(datos));
  return clienteDesdeApi(cliente);
}

export function eliminarCliente(id) {
  return axiosClient.delete(`/clientes/${id}`);
}
