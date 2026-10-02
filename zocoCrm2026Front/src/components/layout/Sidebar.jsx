import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconUsers, IconCalendar, IconMenu, IconLogout } from '../ui/Icons';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar${expanded ? ' expanded' : ''}`}>
      {/* Hamburguesa / toggle de expansión */}
      <button
        className="sidebar-hamburger"
        onClick={() => setExpanded(e => !e)}
        title={expanded ? 'Colapsar menú' : 'Expandir menú'}
      >
        <IconMenu />
      </button>

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        <NavLink
          to="/clientes"
          className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          title={!expanded ? 'Clientes' : undefined}
        >
          <IconUsers />
          <span className="nav-label">Clientes</span>
        </NavLink>

        <NavLink
          to="/gestiones"
          className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          title={!expanded ? 'Gestiones' : undefined}
        >
          <IconCalendar />
          <span className="nav-label">Gestiones</span>
        </NavLink>
      </nav>

      {/* Cerrar sesión */}
      <div className="sidebar-bottom">
        <div
          className="sidebar-nav-item"
          title={!expanded ? 'Cerrar sesión' : undefined}
          onClick={handleLogout}
        >
          <IconLogout />
          <span className="nav-label">Cerrar sesión</span>
        </div>
      </div>
    </aside>
  );
}
