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
              />
            </label>
            <select className="filter-select" defaultValue="" aria-label="Filtrar por tipo">
              <option value="">Todos los tipos</option>
              {tiposContacto.map(tipo => <option key={tipo}>{tipo}</option>)}
            </select>
            <select className="filter-select" defaultValue="" aria-label="Filtrar por asesor">
              <option value="">Todos los asesores</option>
              <option>María González</option>
              <option>Carlos Ruiz</option>
            </select>
            <button className="btn btn-outline btn-sm" type="button">
              <IconArrowUpDown /> Recientes
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => setMostrarModalGestion(true)}>
              Nueva gestión
            </button>
          </div>
        </div>

        <div className="full-history-list">
          {gestionesDemo.map(gestion => {
            const cliente = clientesDisponiblesDemo.find(item => item.cuit === gestion.clienteCuit);

            return (
              <GestionCard key={gestion.id} gestion={gestion} clienteId={cliente?.id} />
            );
          })}
        </div>

        <footer className="pagination-bar">
          <span className="pagination-info">Mostrando 1–5 de {totalGestionesDemo}</span>
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
