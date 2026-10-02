import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch, IconChevronUp, IconChevronDown,
  IconCalendar, IconAlertTriangle, IconX,
  IconUsers,
} from '../../../components/ui/Icons';
import { getInitials, formatDate } from '../../../utils/helpers';
import { ESTADOS, isOverdue, badgeClass } from '../clienteHelpers';
import ClienteFormModal from './ClienteFormModal';
import Pagination from '../../../components/ui/Pagination';
import EmptyState from '../../../components/ui/EmptyState';

export default function ClientesTable({
  clientes = [],
  pagination = { page: 1, pageSize: 5, totalPages: 1, totalItems: 0 },
  onPageChange,
  search = '',
  onSearchChange,
  estado = '',
  onEstadoChange,
  asesor = '',
  onAsesorChange,
  listaAsesores = [],
  loadError = '',
  loading = false,
  onEliminar,
  onUpdateCliente,
  onNuevoCliente,
}) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('proximo');
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.totalItems || clientes.length;
  const pageSize = pagination.pageSize || 5;


  const allSelected = clientes.length > 0 && clientes.every(c => selected.has(c.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => { const n = new Set(prev); clientes.forEach(c => n.delete(c.id)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); clientes.forEach(c => n.add(c.id)); return n; });
    }
  };

  const toggleOne = (id) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const sortByColumn = (col) => {
    if (col === sortBy) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir(col === 'actualizacion' ? 'desc' : 'asc');
    }
  };

  const selectedCount = selected.size;
  const clearSelection = () => setSelected(new Set());
  const selectedClient = selectedCount === 1 ? clientes.find(c => selected.has(c.id)) : null;

  const handleConfirmDelete = () => {
    if (onEliminar) onEliminar([...selected]);
    setSelected(new Set());
    setShowConfirm(false);
  };

  const asesoresDropdown = [...listaAsesores].sort((a, b) => a.localeCompare(b, 'es'));

  const sortedClientes = [...clientes].sort((a, b) => {
    let valA = sortBy === 'proximo' ? a.proximoContacto : a.fechaActualizacion;
    let valB = sortBy === 'proximo' ? b.proximoContacto : b.fechaActualizacion;

    if (!valA && !valB) return 0;
    if (!valA) return 1;
    if (!valB) return -1;

    const timeA = new Date(valA).getTime();
    const timeB = new Date(valB).getTime();

    if (isNaN(timeA)) return 1;
    if (isNaN(timeB)) return -1;

    return sortDir === 'asc' ? timeA - timeB : timeB - timeA;
  });

  return (
    <div className="list-container">
      {/* ── Barra única: info izquierda + controles derecha ── */}
      <div className="table-info-bar">
        <div className="table-info-bar-left">
          {selectedCount === 0 ? (
            <>
              <IconUsers />
              <span>
                {loadError || (loading ? 'Cargando clientes…' : <>Total Clientes: <strong>{totalItems} {totalItems === 1 ? 'cliente' : 'clientes'}</strong></>)}
                {(search || estado || asesor) && (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{' '}(filtrado)</span>
                )}
              </span>
            </>
          ) : (
            <>
              <IconUsers />
              <span>
                <strong>{selectedCount} {selectedCount === 1 ? 'seleccionado' : 'seleccionados'}</strong>
              </span>
              <button type="button" className="selection-clear-btn" onClick={clearSelection}>
                Limpiar
              </button>
              {selectedCount === 1 && (
                <button type="button" className="selection-clear-btn" onClick={() => setShowEdit(true)}>
                  Editar
                </button>
              )}
              <button type="button" className="selection-delete-btn" onClick={() => setShowConfirm(true)}>
                Eliminar ({selectedCount})
              </button>
            </>
          )}
        </div>

        <div className="table-info-bar-right">
          <div className="search-input-wrap">
            <IconSearch />
            <input
              className="search-input"
              type="text"
              placeholder="Buscar…"
              value={search}
              onChange={e => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={estado}
            onChange={e => onEstadoChange && onEstadoChange(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select
            className="filter-select"
            value={asesor}
            onChange={e => onAsesorChange && onAsesorChange(e.target.value)}
          >
            <option value="">Todos los asesores</option>
            {asesoresDropdown.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onNuevoCliente && onNuevoCliente()}>
            Nuevo cliente
          </button>
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th className="td-check">
                <input type="checkbox" className="crm-checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th>Nombre / Razón Social</th>
              <th>CUIT</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Asesor</th>
              <th className="sortable" onClick={() => sortByColumn('proximo')}>
                <div className="th-content">
                  Próximo Contacto
                  {sortBy === 'proximo' ? (
                    <span style={{ display: 'inline-flex', width: 12, height: 12, marginLeft: 4, color: 'var(--accent)' }}>
                      {sortDir === 'desc' ? <IconChevronDown /> : <IconChevronUp />}
                    </span>
                  ) : (
                    <span className="th-sort-hint"><IconChevronUp /></span>
                  )}
                </div>
              </th>
              <th className="sortable" onClick={() => sortByColumn('actualizacion')}>
                <div className="th-content">
                  Última actualización
                  {sortBy === 'actualizacion' ? (
                    <span style={{ display: 'inline-flex', width: 12, height: 12, marginLeft: 4, color: 'var(--accent)' }}>
                      {sortDir === 'desc' ? <IconChevronDown /> : <IconChevronUp />}
                    </span>
                  ) : (
                    <span className="th-sort-hint"><IconChevronUp /></span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loadError || loading || sortedClientes.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <EmptyState
                    icon={!loading ? IconUsers : null}
                    message={loadError || (loading ? 'Cargando clientes…' : 'No se encontraron clientes.')}
                    isError={Boolean(loadError)}
                  />
                </td>
              </tr>
            ) : (
              sortedClientes.map(cliente => {
                const overdue = isOverdue(cliente.proximoContacto);
                const isSelected = selected.has(cliente.id);
                return (
                  <tr
                    key={cliente.id}
                    className={`clickable-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => navigate(`/clientes/${cliente.id}`)}
                  >
                    <td className="td-check" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="crm-checkbox" checked={isSelected} onChange={() => toggleOne(cliente.id)} />
                    </td>
                    <td>
                      <div className="td-name">
                        <div className="td-avatar">{getInitials(cliente.nombre)}</div>
                        {cliente.nombre}
                      </div>
                    </td>
                    <td className="td-mono">{cliente.cuit}</td>
                    <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{cliente.telefono}</td>
                    <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{cliente.email || '—'}</td>
                    <td>
                      <span className={`badge ${badgeClass(cliente.estado)}`}>{cliente.estado}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{cliente.asesor}</td>
                    <td>
                      <div className={`date-cell${overdue ? ' overdue' : ''}`}>
                        {overdue ? <IconAlertTriangle /> : <IconCalendar />}
                        {formatDate(cliente.proximoContacto)}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(cliente.fechaActualizacion)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ── */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange || (() => {})}
      />

      {/* ── Modal confirmación borrado masivo ── */}
      {showConfirm && selectedCount > 0 && (
        <div className="modal-backdrop" onClick={() => setShowConfirm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div>
                  <h3 className="modal-title">Eliminar {selectedCount} cliente(s)</h3>
                </div>
              </div>
              <button className="panel-close-btn" onClick={() => setShowConfirm(false)} title="Cerrar ventana">
                <IconX />
              </button>
            </div>

            <div className="modal-body modal-form">
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Se archivarán {selectedCount} cliente(s) junto con su historial de gestiones.
                Esta acción no se puede deshacer.
              </p>

              <div className="modal-form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowConfirm(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal edición del único seleccionado ── */}
      {showEdit && selectedClient && (
        <ClienteFormModal
          initial={selectedClient}
          clientes={clientes}
          listaAsesores={listaAsesores}
          onClose={() => setShowEdit(false)}
          onSubmit={(patch) => {
            if (onUpdateCliente) onUpdateCliente(selectedClient.id, patch);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
}
