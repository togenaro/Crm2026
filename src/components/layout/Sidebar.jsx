import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconCalendar, IconLogout, IconMenu, IconUsers } from '../ui/Icons';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className={`sidebar${expanded ? ' expanded' : ''}`} aria-label="Navegación principal">
      <button className="sidebar-hamburger" type="button" aria-label={expanded ? 'Contraer menú' : 'Expandir menú'} aria-expanded={expanded} onClick={() => setExpanded(value => !value)} title={expanded ? 'Contraer menú' : 'Expandir menú'}>
        <IconMenu />
      </button>
      <nav className="sidebar-nav">
        <NavLink to="/clientes" className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`} title={!expanded ? 'Clientes' : undefined}>
          <IconUsers /><span className="nav-label">Clientes</span>
        </NavLink>
        <NavLink to="/gestiones" className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`} title={!expanded ? 'Gestiones' : undefined}>
          <IconCalendar /><span className="nav-label">Gestiones</span>
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-nav-item" type="button" title={!expanded ? 'Cerrar sesión' : undefined} onClick={handleLogout}>
          <IconLogout /><span className="nav-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
