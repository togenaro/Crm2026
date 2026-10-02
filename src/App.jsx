import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="content-wrapper">
          <header className="page-header">
            <h1 className="page-title">Clientes</h1>
          </header>
        </main>
      </div>
    </div>
  );
}
