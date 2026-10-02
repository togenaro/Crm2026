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
        {/* Avatar usuario con iniciales */}
        <div
          title={usuario?.nombre || ''}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: '#f97316',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {getInitials(usuario?.nombre || '')}
        </div>
      </div>
    </header>
  );
}
