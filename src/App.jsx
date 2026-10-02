import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ClienteDetailPage from './features/clientes/pages/ClienteDetailPage';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar activeItem="Clientes" />
      <div className="main-area">
        <Topbar />
        <main className="content-wrapper">
          <ClienteDetailPage />
        </main>
      </div>
    </div>
  );
}
