import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (nombre) => {
    login(nombre);
    navigate('/clientes');
  };

  return (
    <div className="login-page">
      <LoginForm onLoginSuccess={handleSuccess} />
    </div>
  );
}
