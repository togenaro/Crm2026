import { useState } from 'react';
import {
  IconArrowUpDown,
  IconCalendar,
  IconSearch,
} from '../../../components/ui/Icons';
import GestionCard from '../components/GestionCard';
import GestionModal from '../components/GestionModal';

const tiposContacto = ['Llamada', 'WhatsApp', 'Correo', 'Reunión', 'Otro'];
const TAMANO_PAGINA = 5;

export default function GestionesPage({ clientes, gestiones, onAgregarGestion }) {
  const [mostrarModalGestion, setMostrarModalGestion] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('');
  const [asesor, setAsesor] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [pagina, setPagina] = useState(1);
  const terminoBusqueda = busqueda.trim().toLocaleLowerCase('es');
  const asesores = [...new Set(gestiones.map(gestion => gestion.asesor).filter(Boolean))]
    .sort((primero, segundo) => primero.localeCompare(segundo, 'es'));
  const gestionesFiltradas = gestiones
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
  const totalPaginas = Math.max(1, Math.ceil(gestionesFiltradas.length / TAMANO_PAGINA));
  const indiceInicial = (pagina - 1) * TAMANO_PAGINA;
  const gestionesVisibles = gestionesFiltradas.slice(indiceInicial, indiceInicial + TAMANO_PAGINA);
  const numeroInicial = gestionesFiltradas.length === 0 ? 0 : indiceInicial + 1;
  const numeroFinal = Math.min(indiceInicial + TAMANO_PAGINA, gestionesFiltradas.length);

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
              Total Gestiones: <strong>{gestiones.length} gestiones</strong>
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
                onChange={event => {
                  setBusqueda(event.target.value);
                  setPagina(1);
                }}
              />
            </label>
            <select className="filter-select" value={tipo} onChange={event => {
              setTipo(event.target.value);
              setPagina(1);
            }} aria-label="Filtrar por tipo">
              <option value="">Todos los tipos</option>
              {tiposContacto.map(tipo => <option key={tipo}>{tipo}</option>)}
            </select>
            <select className="filter-select" value={asesor} onChange={event => {
              setAsesor(event.target.value);
              setPagina(1);
            }} aria-label="Filtrar por asesor">
              <option value="">Todos los asesores</option>
              {asesores.map(nombre => <option key={nombre}>{nombre}</option>)}
            </select>
            <button
              className="btn btn-outline btn-sm"
              type="button"
              title="Cambiar orden por fecha"
              onClick={() => {
                setSortDir(actual => actual === 'desc' ? 'asc' : 'desc');
                setPagina(1);
              }}
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
          ) : gestionesVisibles.map(gestion => {
            const cliente = clientes.find(item => item.cuit === gestion.clienteCuit);

            return (
              <GestionCard key={gestion.id} gestion={gestion} clienteId={cliente?.id} />
            );
          })}
        </div>

        <footer className="pagination-bar">
          <span className="pagination-info">
            {gestionesFiltradas.length === 0
              ? '0 resultados'
              : `Mostrando ${numeroInicial}–${numeroFinal} de ${gestionesFiltradas.length}${hayFiltrosActivos ? ' resultados' : ''}`}
          </span>
          <div className="pagination-controls">
            <button className="page-btn" type="button" disabled={pagina === 1} onClick={() => setPagina(actual => Math.max(1, actual - 1))}>
              ‹ Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(numero => (
              <button
                key={numero}
                className={`page-btn${pagina === numero ? ' active' : ''}`}
                type="button"
                aria-current={pagina === numero ? 'page' : undefined}
                onClick={() => setPagina(numero)}
              >
                {numero}
              </button>
            ))}
            <button className="page-btn" type="button" disabled={pagina === totalPaginas} onClick={() => setPagina(actual => Math.min(totalPaginas, actual + 1))}>
              Siguiente ›
            </button>
          </div>
        </footer>
      </section>
      {mostrarModalGestion && (
        <GestionModal
          clientes={clientes}
          onClose={() => setMostrarModalGestion(false)}
          onGuardar={datos => {
            onAgregarGestion(datos);
            setPagina(1);
            setMostrarModalGestion(false);
          }}
        />
      )}
    </div>
  );
}
