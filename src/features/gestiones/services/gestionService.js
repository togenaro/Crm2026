import axiosClient from '../../../api/axiosClient';

function formatoEstado(estado) {
  return estado === 'NoInteresado' ? 'No interesado' : estado;
}

function formatoTipo(tipo) {
  return tipo === 'Reunion' ? 'Reunión' : tipo;
}

function fechaCorta(fecha) {
  return fecha ? fecha.slice(0, 10) : '';
}

function gestionDesdeApi(gestion, clientes = []) {
  const cliente = clientes.find(item => String(item.id) === String(gestion.clienteId));
  return {
    ...gestion,
    tipoContacto: formatoTipo(gestion.tipoContacto),
    fechaGestion: gestion.fechaGestion,
    proximoContacto: fechaCorta(gestion.proximoContacto),
    estadoResultante: formatoEstado(gestion.estadoResultante),
    clienteNombre: gestion.clienteNombre ?? cliente?.nombre ?? '',
    clienteCuit: gestion.clienteCuit ?? cliente?.cuit ?? '',
  };
}

function estadoParaApi(estado) {
  return estado === 'No interesado' ? 'NoInteresado' : estado;
}

function tipoParaApi(tipo) {
  return tipo === 'Reunión' ? 'Reunion' : tipo === 'Correo' ? 'Correo' : tipo;
}

export async function listarGestiones(clientes) {
  const { data: resultado } = await axiosClient.get('/gestiones', {
    params: { page: 1, pageSize: 1000 },
  });
  return resultado.items.map(gestion => gestionDesdeApi(gestion, clientes));
}

export async function crearGestion(clienteId, datos) {
  const fechaGestion = new Date(`${datos.fechaGestion}T${datos.horaGestion}:00`).toISOString();
  const proximoContacto = datos.proximoContacto ? `${datos.proximoContacto}T12:00:00` : null;
  const { data: gestion } = await axiosClient.post(`/clientes/${clienteId}/gestiones`, {
    tipoContacto: tipoParaApi(datos.tipoContacto),
    comentario: datos.comentario,
    estadoResultante: estadoParaApi(datos.estadoResultante),
    fechaGestion,
    proximoContacto,
    asesor: datos.asesor,
  });
  return gestionDesdeApi(gestion);
}

export async function actualizarGestion(clienteId, gestionId, datos) {
  const fechaGestion = new Date(`${datos.fechaGestion}T${datos.horaGestion}:00`).toISOString();
  const proximoContacto = datos.proximoContacto ? `${datos.proximoContacto}T12:00:00` : null;
  const { data: gestion } = await axiosClient.put(`/clientes/${clienteId}/gestiones/${gestionId}`, {
    tipoContacto: tipoParaApi(datos.tipoContacto),
    comentario: datos.comentario,
    estadoResultante: estadoParaApi(datos.estadoResultante),
    fechaGestion,
    proximoContacto,
  });
  return gestionDesdeApi(gestion);
}
