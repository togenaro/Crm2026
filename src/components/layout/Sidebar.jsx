import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17l5-5-5-5M15 12H3" />
      <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
    </svg>
  );
}

function SidebarItem({ label, children, to }) {
  const className = ({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`;

  return (
    <NavLink className={className} to={to} end title={label} aria-label={label}>
      {children}
      <span className="nav-label">{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const [expandido, setExpandido] = useState(false);

  return (
    <aside className={`sidebar${expandido ? ' expanded' : ''}`} aria-label="Navegación principal">
      <button
        className="sidebar-hamburger"
        type="button"
        aria-label={expandido ? 'Contraer menú' : 'Expandir menú'}
        aria-expanded={expandido}
        title={expandido ? 'Contraer menú' : 'Expandir menú'}
        onClick={() => setExpandido(actual => !actual)}
      >
        <MenuIcon />
      </button>

      <nav className="sidebar-nav">
        <SidebarItem label="Clientes" to="/clientes">
          <UsersIcon />
        </SidebarItem>
        <SidebarItem label="Gestiones" to="/gestiones">
          <CalendarIcon />
        </SidebarItem>
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-nav-item" type="button" title="Cerrar sesión" aria-label="Cerrar sesión">
          <LogoutIcon />
          <span className="nav-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
