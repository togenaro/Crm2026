import { useState } from 'react';
import {
  IconArrowUpDown,
  IconCalendar,
  IconSearch,
} from '../../../components/ui/Icons';
import GestionCard from '../components/GestionCard';
import GestionModal from '../components/GestionModal';
import { clientesDisponiblesDemo } from '../../clientes/data/clientesDemo';
import { gestionesDemo, totalGestionesDemo } from '../data/gestionesDemo';

const tiposContacto = ['Llamada', 'WhatsApp', 'Correo', 'Reunión', 'Otro'];

export default function GestionesPage() {
  const [mostrarModalGestion, setMostrarModalGestion] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('');
  const [asesor, setAsesor] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const terminoBusqueda = busqueda.trim().toLocaleLowerCase('es');
  const asesores = [...new Set(gestionesDemo.map(gestion => gestion.asesor).filter(Boolean))]
    .sort((primero, segundo) => primero.localeCompare(segundo, 'es'));
  const gestionesFiltradas = gestionesDemo
    .filter(gestion => {
      const coincideBusqueda = !terminoBusqueda || [
        gestion.clienteNombre,
        gestion.comentario,
        gestion.asesor,
      ].some(valor => valor?.toLocaleLowerCase('es').includes(terminoBusqueda));
      const coincideTipo = !tipo || gestion.tipoContacto === tipo;
      const coincideAsesor = !asesor || gestion.asesor === asesor;

      return coincideBusqueda && coincideTipo && coincideAsesor;
    })
    .sort((primera, segunda) => {
      const fechaPrimera = new Date(primera.fechaGestion).getTime();
      const fechaSegunda = new Date(segunda.fechaGestion).getTime();

      return sortDir === 'desc' ? fechaSegunda - fechaPrimera : fechaPrimera - fechaSegunda;
    });
  const hayFiltrosActivos = Boolean(terminoBusqueda || tipo || asesor);

  return (
    <div className="gestiones-view">
      <header className="page-header">
        <h1 className="page-title">Gestiones</h1>
      </header>

      <section className="list-container" aria-label="Listado de gestiones">
        <div className="table-info-bar">
          <div className="table-info-bar-left">
            <IconCalendar />
            <span>
              Total Gestiones: <strong>{totalGestionesDemo} gestiones</strong>
            </span>
          </div>

          <div className="table-info-bar-right">
            <label className="search-input-wrap">
              <IconSearch />
              <input
                className="search-input"
                type="search"
                placeholder="Buscar por cliente, comentario o asesor…"
                aria-label="Buscar gestiones"
                value={busqueda}
                onChange={event => setBusqueda(event.target.value)}
              />
            </label>
            <select className="filter-select" value={tipo} onChange={event => setTipo(event.target.value)} aria-label="Filtrar por tipo">
              <option value="">Todos los tipos</option>
              {tiposContacto.map(tipo => <option key={tipo}>{tipo}</option>)}
            </select>
            <select className="filter-select" value={asesor} onChange={event => setAsesor(event.target.value)} aria-label="Filtrar por asesor">
              <option value="">Todos los asesores</option>
              {asesores.map(nombre => <option key={nombre}>{nombre}</option>)}
            </select>
            <button
              className="btn btn-outline btn-sm"
              type="button"
              title="Cambiar orden por fecha"
              onClick={() => setSortDir(actual => actual === 'desc' ? 'asc' : 'desc')}
            >
              <IconArrowUpDown /> {sortDir === 'desc' ? 'Recientes' : 'Antiguas'}
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => setMostrarModalGestion(true)}>
              Nueva gestión
            </button>
          </div>
        </div>

        <div className="full-history-list">
          {gestionesFiltradas.length === 0 ? (
            <p className="pagination-info">No se encontraron gestiones con esos criterios.</p>
          ) : gestionesFiltradas.map(gestion => {
            const cliente = clientesDisponiblesDemo.find(item => item.cuit === gestion.clienteCuit);

            return (
              <GestionCard key={gestion.id} gestion={gestion} clienteId={cliente?.id} />
            );
          })}
        </div>

        <footer className="pagination-bar">
          <span className="pagination-info">
            {hayFiltrosActivos
              ? `${gestionesFiltradas.length} ${gestionesFiltradas.length === 1 ? 'resultado' : 'resultados'}`
              : `Mostrando 1–5 de ${totalGestionesDemo}`}
          </span>
          <div className="pagination-controls">
            <button className="page-btn" type="button" disabled>‹ Anterior</button>
            <button className="page-btn active" type="button" aria-current="page">1</button>
            <button className="page-btn" type="button">2</button>
            <button className="page-btn" type="button">3</button>
            <button className="page-btn" type="button">Siguiente ›</button>
          </div>
        </footer>
      </section>
      {mostrarModalGestion && (
        <GestionModal clientes={clientesDisponiblesDemo} onClose={() => setMostrarModalGestion(false)} />
      )}
    </div>
  );
}
