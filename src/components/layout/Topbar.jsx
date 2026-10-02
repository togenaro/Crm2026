import { IconBolt } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function Topbar() {
  const { usuario } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <IconBolt />
        <span>ZOCO CRM</span>
      </div>
      <div className="topbar-right">
        <div className="user-avatar" title={usuario?.nombre || ''} aria-label={usuario?.nombre || 'Usuario'}>
          {getInitials(usuario?.nombre || '')}
        </div>
      </div>
    </header>
  );
}
