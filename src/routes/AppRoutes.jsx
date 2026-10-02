import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import ClientesPage from '../features/clientes/pages/ClientesPage';
import ClienteDetailPage from '../features/clientes/pages/ClienteDetailPage';
import GestionesPage from '../features/gestiones/pages/GestionesPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/clientes" replace />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/clientes/:id" element={<ClienteDetailPage />} />
        <Route path="/gestiones" element={<GestionesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/clientes" replace />} />
    </Routes>
  );
}
