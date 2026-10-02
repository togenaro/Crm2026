import LoginForm from '../components/LoginForm';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <LoginForm onLoginSuccess={nombre => {
        login(nombre);
        navigate('/clientes');
      }} />
    </main>
  );
}
