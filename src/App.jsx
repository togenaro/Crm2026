import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ClienteDetailPage from './features/clientes/pages/ClienteDetailPage';
import ClientesPage from './features/clientes/pages/ClientesPage';
import GestionesPage from './features/gestiones/pages/GestionesPage';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="content-wrapper">
          <Routes>
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes/:clienteId" element={<ClienteDetailPage />} />
            <Route path="/gestiones" element={<GestionesPage />} />
            <Route path="*" element={<Navigate to="/clientes" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
