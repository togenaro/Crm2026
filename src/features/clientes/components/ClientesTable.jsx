import { useState } from 'react';
import {
  IconAlertTriangle,
  IconCalendar,
  IconChevronUp,
  IconSearch,
  IconUsers,
} from '../../../components/ui/Icons';
import Modal from '../../../components/ui/Modal';
import ClienteModal from './ClienteModal';

function formatDate(date) {
  if (!date) return '—';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

function statusClass(status) {
  const classes = {
    Prospecto: 'badge-prospecto',
    Contactado: 'badge-contactado',
    Interesado: 'badge-interesado',
    'No interesado': 'badge-no_interesado',
    Cliente: 'badge-cliente',
  };
  return classes[status] || 'badge-prospecto';
}

export default function ClientesTable({ clientes, totalClientes }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [seleccionados, setSeleccionados] = useState(() => new Set());
  const todosSeleccionados = clientes.length > 0 && clientes.every(cliente => seleccionados.has(cliente.id));
  const cantidadSeleccionada = seleccionados.size;
  const clienteSeleccionado = cantidadSeleccionada === 1
    ? clientes.find(cliente => seleccionados.has(cliente.id))
    : null;

  function alternarSeleccionTodos() {
    setSeleccionados(actuales => {
      const nuevaSeleccion = new Set(actuales);
      if (todosSeleccionados) clientes.forEach(cliente => nuevaSeleccion.delete(cliente.id));
      else clientes.forEach(cliente => nuevaSeleccion.add(cliente.id));
      return nuevaSeleccion;
    });
  }

  function alternarSeleccion(id) {
    setSeleccionados(actuales => {
      const nuevaSeleccion = new Set(actuales);
      if (nuevaSeleccion.has(id)) nuevaSeleccion.delete(id);
      else nuevaSeleccion.add(id);
      return nuevaSeleccion;
    });
  }

  return (
    <section className="list-container" aria-label="Listado de clientes">
      <div className="table-info-bar">
        <div className="table-info-bar-left">
          {cantidadSeleccionada === 0 ? (
            <>
              <IconUsers />
              <span>Total Clientes: <strong>{totalClientes} {totalClientes === 1 ? 'cliente' : 'clientes'}</strong></span>
            </>
          ) : (
            <>
              <IconUsers />
              <span><strong>{cantidadSeleccionada} {cantidadSeleccionada === 1 ? 'seleccionado' : 'seleccionados'}</strong></span>
              <button className="selection-clear-btn" type="button" onClick={() => setSeleccionados(new Set())}>Limpiar</button>
              {clienteSeleccionado && (
                <button className="selection-clear-btn" type="button" onClick={() => setClienteAEditar(clienteSeleccionado)}>Editar</button>
              )}
              <button className="selection-delete-btn" type="button" onClick={() => setMostrarConfirmacion(true)}>
                Eliminar ({cantidadSeleccionada})
              </button>
            </>
          )}
        </div>

        <div className="table-info-bar-right">
          <label className="search-input-wrap">
            <IconSearch />
            <input className="search-input" type="search" placeholder="Buscar…" aria-label="Buscar clientes" />
          </label>
          <select className="filter-select" defaultValue="" aria-label="Filtrar por estado">
            <option value="">Todos los estados</option>
            <option>Prospecto</option>
            <option>Contactado</option>
            <option>Interesado</option>
            <option>No interesado</option>
            <option>Cliente</option>
          </select>
          <select className="filter-select" defaultValue="" aria-label="Filtrar por asesor">
            <option value="">Todos los asesores</option>
            <option>María González</option>
            <option>Carlos Ruiz</option>
          </select>
          <button className="btn btn-primary btn-sm" type="button" onClick={() => setMostrarModal(true)}>Nuevo cliente</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th className="td-check"><input className="crm-checkbox" type="checkbox" aria-label="Seleccionar todos" checked={todosSeleccionados} onChange={alternarSeleccionTodos} /></th>
              <th>Nombre / Razón Social</th>
              <th>CUIT</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Asesor</th>
              <th className="sortable"><span className="th-content">Próximo Contacto <IconChevronUp /></span></th>
              <th className="sortable">Última actualización</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id} className={seleccionados.has(cliente.id) ? 'selected' : ''}>
                <td className="td-check"><input className="crm-checkbox" type="checkbox" aria-label={`Seleccionar ${cliente.nombre}`} checked={seleccionados.has(cliente.id)} onChange={() => alternarSeleccion(cliente.id)} /></td>
                <td><div className="td-name"><span className="td-avatar">{initials(cliente.nombre)}</span>{cliente.nombre}</div></td>
                <td className="td-mono">{cliente.cuit}</td>
                <td className="cell-secondary">{cliente.telefono}</td>
                <td className="cell-secondary">{cliente.email || '—'}</td>
                <td><span className={`badge ${statusClass(cliente.estado)}`}>{cliente.estado}</span></td>
                <td className="cell-secondary">{cliente.asesor}</td>
                <td>
                  <div className={`date-cell${cliente.vencido ? ' overdue' : ''}`}>
                    {cliente.vencido ? <IconAlertTriangle /> : <IconCalendar />}
                    {formatDate(cliente.proximoContacto)}
                  </div>
                </td>
                <td className="cell-muted">{formatDate(cliente.fechaActualizacion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="pagination-bar">
        <span className="pagination-info">Mostrando 1–5 de {totalClientes}</span>
        <div className="pagination-controls">
          <button className="page-btn" type="button" disabled>‹ Anterior</button>
          <button className="page-btn active" type="button" aria-current="page">1</button>
          <button className="page-btn" type="button">2</button>
          <button className="page-btn" type="button">Siguiente ›</button>
        </div>
      </footer>
      {mostrarModal && <ClienteModal onClose={() => setMostrarModal(false)} />}
      {clienteAEditar && <ClienteModal initial={clienteAEditar} onClose={() => setClienteAEditar(null)} />}
      {mostrarConfirmacion && (
        <Modal title={`Eliminar ${cantidadSeleccionada} cliente(s)`} onClose={() => setMostrarConfirmacion(false)}>
          <div className="modal-body modal-form">
            <p className="delete-confirmation-message">
              Se archivarán {cantidadSeleccionada} cliente(s) junto con su historial de gestiones. Esta acción no se puede deshacer.
            </p>
            <div className="modal-form-actions">
              <button className="btn btn-outline" type="button" onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
              <button className="btn btn-danger" type="button">Eliminar</button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
