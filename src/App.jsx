import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ClientesPage from './features/clientes/pages/ClientesPage';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar activeItem="Clientes" />
      <div className="main-area">
        <Topbar />
        <main className="content-wrapper">
          <ClientesPage />
        </main>
      </div>
    </div>
  );
}
