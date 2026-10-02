import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ClienteDetailPage from './features/clientes/pages/ClienteDetailPage';
import ClientesPage from './features/clientes/pages/ClientesPage';
import { clientesDisponiblesDemo } from './features/clientes/data/clientesDemo';
import { gestionesDemo } from './features/gestiones/data/gestionesDemo';
import GestionesPage from './features/gestiones/pages/GestionesPage';

export default function App() {
  const [clientes, setClientes] = useState(clientesDisponiblesDemo);
  const [gestiones, setGestiones] = useState(gestionesDemo);

  function agregarGestion(datos) {
    const cliente = clientes.find(item => String(item.id) === String(datos.clienteId));
    if (!cliente) return;

    const fechaGestion = new Date(`${datos.fechaGestion}T${datos.horaGestion}:00`).toISOString();
    const nuevaGestion = {
      id: String(Date.now()),
      clienteId: cliente.id,
      clienteNombre: cliente.nombre,
      clienteCuit: cliente.cuit,
      tipoContacto: datos.tipoContacto,
      fechaGestion,
      comentario: datos.comentario,
      estadoResultante: datos.estadoResultante,
      proximoContacto: datos.proximoContacto,
      asesor: cliente.asesor,
    };

    setGestiones(actuales => [nuevaGestion, ...actuales]);
    setClientes(actuales => actuales.map(item => item.id === cliente.id
      ? {
        ...item,
        estado: datos.estadoResultante,
        proximoContacto: datos.proximoContacto,
        fechaActualizacion: datos.fechaGestion,
        vencido: Boolean(datos.proximoContacto && datos.proximoContacto < new Date().toISOString().slice(0, 10)),
      }
      : item));
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="content-wrapper">
          <Routes>
            <Route path="/clientes" element={<ClientesPage clientes={clientes} />} />
            <Route path="/clientes/:clienteId" element={<ClienteDetailPage clientes={clientes} gestiones={gestiones} onAgregarGestion={agregarGestion} />} />
            <Route path="/gestiones" element={<GestionesPage clientes={clientes} gestiones={gestiones} onAgregarGestion={agregarGestion} />} />
            <Route path="*" element={<Navigate to="/clientes" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
