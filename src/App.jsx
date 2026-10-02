import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import GestionesPage from './features/gestiones/pages/GestionesPage';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar activeItem="Gestiones" />
      <div className="main-area">
        <Topbar />
        <main className="content-wrapper">
          <GestionesPage />
        </main>
      </div>
    </div>
  );
}
