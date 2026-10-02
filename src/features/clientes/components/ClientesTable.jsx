import {
  IconAlertTriangle,
  IconCalendar,
  IconChevronUp,
  IconSearch,
  IconUsers,
} from '../../../components/ui/Icons';

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
  return (
    <section className="list-container" aria-label="Listado de clientes">
      <div className="table-info-bar">
        <div className="table-info-bar-left">
          <IconUsers />
          <span>Total Clientes: <strong>{totalClientes} clientes</strong></span>
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
          <button className="btn btn-primary btn-sm" type="button">Nuevo cliente</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th className="td-check"><input className="crm-checkbox" type="checkbox" aria-label="Seleccionar todos" /></th>
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
              <tr key={cliente.id}>
                <td className="td-check"><input className="crm-checkbox" type="checkbox" aria-label={`Seleccionar ${cliente.nombre}`} /></td>
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
    </section>
  );
}
