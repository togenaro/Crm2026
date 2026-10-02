import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconAlertTriangle,
  IconCalendar,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconUsers,
} from '../../../components/ui/Icons';
import Modal from '../../../components/ui/Modal';
import ClienteFormModal from './ClienteFormModal';
import EmptyState from '../../../components/ui/EmptyState';
import Pagination from '../../../components/ui/Pagination';
import ApiErrorList from '../../../components/ui/ApiErrorList';
import { badgeClass } from '../clienteHelpers';
import { formatDate, getInitials } from '../../../utils/helpers';

export default function ClientesTable({
  clientes,
  todosLosClientes,
  totalClientes,
  busqueda,
  onBusquedaChange,
  estado,
  onEstadoChange,
  asesor,
  onAsesorChange,
  asesores,
  pagina,
  totalPaginas,
  onPaginaChange,
  sortBy,
  sortDir,
  onOrdenar,
  onGuardarCliente,
  onEliminarClientes,
  cargando,
  loadError,
}) {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [seleccionados, setSeleccionados] = useState(() => new Set());
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminacion, setErrorEliminacion] = useState('');
  const todosSeleccionados = clientes.length > 0 && clientes.every(cliente => seleccionados.has(cliente.id));
  const cantidadSeleccionada = seleccionados.size;
  const clienteSeleccionado = cantidadSeleccionada === 1
    ? todosLosClientes.find(cliente => seleccionados.has(cliente.id))
    : null;

  function activarOrdenConTeclado(event, columna) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onOrdenar(columna);
  }

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
              <span>
                {loadError || (cargando
                  ? 'Cargando clientes…'
                  : <>Total Clientes: <strong>{totalClientes} {totalClientes === 1 ? 'cliente' : 'clientes'}</strong></>)}
                {(busqueda.trim() || estado || asesor) && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> (filtrado)</span>}
              </span>
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
            <input
              className="search-input"
              type="search"
              placeholder="Buscar…"
              aria-label="Buscar clientes por nombre, CUIT o teléfono"
              value={busqueda}
              onChange={event => onBusquedaChange(event.target.value)}
            />
          </label>
          <select className="filter-select" value={estado} onChange={event => onEstadoChange(event.target.value)} aria-label="Filtrar por estado">
            <option value="">Todos los estados</option>
            <option>Prospecto</option>
            <option>Contactado</option>
            <option>Interesado</option>
            <option>No interesado</option>
            <option>Cliente</option>
          </select>
          <select className="filter-select" value={asesor} onChange={event => onAsesorChange(event.target.value)} aria-label="Filtrar por asesor">
            <option value="">Todos los asesores</option>
            {asesores.map(nombreAsesor => <option key={nombreAsesor}>{nombreAsesor}</option>)}
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
              <th
                className="sortable"
                scope="col"
                tabIndex={0}
                aria-sort={sortBy === 'proximo' ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                onClick={() => onOrdenar('proximo')}
                onKeyDown={event => activarOrdenConTeclado(event, 'proximo')}
              >
                <span className="th-content">
                  Próximo Contacto
                  {sortBy === 'proximo' ? (
                    <span className="th-sort-indicator">
                      {sortDir === 'desc' ? <IconChevronDown /> : <IconChevronUp />}
                    </span>
                  ) : (
                    <span className="th-sort-hint"><IconChevronUp /></span>
                  )}
                </span>
              </th>
              <th
                className="sortable"
                scope="col"
                tabIndex={0}
                aria-sort={sortBy === 'actualizacion' ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                onClick={() => onOrdenar('actualizacion')}
                onKeyDown={event => activarOrdenConTeclado(event, 'actualizacion')}
              >
                <span className="th-content">
                  Última actualización
                  {sortBy === 'actualizacion' ? (
                    <span className="th-sort-indicator">
                      {sortDir === 'desc' ? <IconChevronDown /> : <IconChevronUp />}
                    </span>
                  ) : (
                    <span className="th-sort-hint"><IconChevronUp /></span>
                  )}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loadError || cargando || clientes.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <EmptyState
                    icon={!cargando ? IconUsers : null}
                    message={loadError || (cargando ? 'Cargando clientes…' : 'No se encontraron clientes.')}
                    isError={Boolean(loadError)}
                  />
                </td>
              </tr>
            ) : clientes.map(cliente => (
              <tr
                key={cliente.id}
                className={seleccionados.has(cliente.id) ? 'selected' : ''}
                tabIndex={0}
                aria-label={`Abrir ficha de ${cliente.nombre}`}
                onClick={event => {
                  if (event.target.closest('input[type="checkbox"]')) return;
                  navigate(`/clientes/${cliente.id}`);
                }}
                onKeyDown={event => {
                  if (event.target === event.currentTarget && event.key === 'Enter') {
                    navigate(`/clientes/${cliente.id}`);
                  }
                }}
              >
                <td className="td-check"><input className="crm-checkbox" type="checkbox" aria-label={`Seleccionar ${cliente.nombre}`} checked={seleccionados.has(cliente.id)} onChange={() => alternarSeleccion(cliente.id)} /></td>
                <td><div className="td-name"><span className="td-avatar">{getInitials(cliente.nombre)}</span>{cliente.nombre}</div></td>
                <td className="td-mono">{cliente.cuit}</td>
                <td className="cell-secondary cell-nowrap">{cliente.telefono}</td>
                <td className="cell-secondary cell-nowrap">{cliente.email || '—'}</td>
                <td><span className={`badge ${badgeClass(cliente.estado)}`}>{cliente.estado}</span></td>
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

      {!loadError && !cargando && (
        <Pagination
          page={pagina}
          totalPages={totalPaginas}
          totalItems={totalClientes}
          pageSize={5}
          onPageChange={onPaginaChange}
        />
      )}
      {mostrarModal && <ClienteFormModal clientes={todosLosClientes} onGuardar={datos => onGuardarCliente(datos)} onClose={() => setMostrarModal(false)} />}
      {clienteAEditar && <ClienteFormModal clientes={todosLosClientes} initial={clienteAEditar} onGuardar={datos => onGuardarCliente(datos, clienteAEditar.id)} onClose={() => setClienteAEditar(null)} />}
      {mostrarConfirmacion && (
        <Modal title={`Eliminar ${cantidadSeleccionada} cliente(s)`} onClose={() => setMostrarConfirmacion(false)}>
          <div className="modal-body modal-form">
            <p className="delete-confirmation-message">
              Se archivarán {cantidadSeleccionada} cliente(s) junto con su historial de gestiones. Esta acción no se puede deshacer.
            </p>
            <ApiErrorList errors={errorEliminacion ? [errorEliminacion] : []} />
            <div className="modal-form-actions">
              <button className="btn btn-outline" type="button" onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
              <button className="btn btn-danger" type="button" disabled={eliminando} onClick={async () => {
                setEliminando(true);
                setErrorEliminacion('');
                try {
                  await onEliminarClientes([...seleccionados]);
                  setSeleccionados(new Set());
                  setMostrarConfirmacion(false);
                } catch (error) {
                  setErrorEliminacion(error.message);
                } finally {
                  setEliminando(false);
                }
              }}>{eliminando ? 'Eliminando…' : 'Eliminar'}</button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
