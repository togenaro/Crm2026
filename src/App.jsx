import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ClienteDetailPage from './features/clientes/pages/ClienteDetailPage';
import ClientesPage from './features/clientes/pages/ClientesPage';
import { listarClientes, crearCliente, actualizarCliente, eliminarCliente } from './features/clientes/services/clienteService';
import { crearGestion, listarGestiones } from './features/gestiones/services/gestionService';
import GestionesPage from './features/gestiones/pages/GestionesPage';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const recargarDatos = useCallback(async () => {
    const clientesActuales = await listarClientes();
    const gestionesActuales = await listarGestiones(clientesActuales);
    setClientes(clientesActuales);
    setGestiones(gestionesActuales);
    setError('');
  }, []);

  async function refrescarDespuesDeGuardar() {
    try {
      await recargarDatos();
    } catch (errorCarga) {
      setError(`El cambio se guardó, pero no se pudo actualizar la pantalla: ${errorCarga.message}`);
    }
  }

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        await recargarDatos();
      } catch (errorCarga) {
        if (activo) setError(errorCarga.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarDatos();
    return () => { activo = false; };
  }, [recargarDatos]);

  async function guardarCliente(datos, clienteId) {
    if (clienteId) await actualizarCliente(clienteId, datos);
    else await crearCliente(datos);
    await refrescarDespuesDeGuardar();
  }

  async function borrarClientes(ids) {
    await Promise.all(ids.map(eliminarCliente));
    await refrescarDespuesDeGuardar();
  }

  async function agregarGestion(datos) {
    const cliente = clientes.find(item => String(item.id) === String(datos.clienteId));
    if (!cliente) throw new Error('Seleccioná un cliente válido para registrar la gestión.');

    await crearGestion(cliente.id, { ...datos, asesor: cliente.asesor });
    await refrescarDespuesDeGuardar();
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="content-wrapper">
          {error && <p className="api-error" role="alert">{error}</p>}
          <Routes>
            <Route path="/clientes" element={<ClientesPage clientes={clientes} cargando={cargando} onGuardarCliente={guardarCliente} onEliminarClientes={borrarClientes} />} />
            <Route path="/clientes/:clienteId" element={<ClienteDetailPage clientes={clientes} gestiones={gestiones} cargando={cargando} onGuardarCliente={guardarCliente} onAgregarGestion={agregarGestion} />} />
            <Route path="/gestiones" element={<GestionesPage clientes={clientes} gestiones={gestiones} cargando={cargando} onAgregarGestion={agregarGestion} />} />
            <Route path="*" element={<Navigate to="/clientes" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
