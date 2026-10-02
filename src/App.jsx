import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ClienteDetailPage from './features/clientes/pages/ClienteDetailPage';
import ClientesPage from './features/clientes/pages/ClientesPage';
import { listarClientes, crearCliente, actualizarCliente, eliminarCliente } from './features/clientes/services/clienteService';
import { actualizarGestion, crearGestion, listarGestiones } from './features/gestiones/services/gestionService';
import { obtenerResumen } from './features/clientes/services/dashboardService';
import GestionesPage from './features/gestiones/pages/GestionesPage';
import { useToast } from './context/useToast';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const [cargandoGestiones, setCargandoGestiones] = useState(true);
  const [errorClientes, setErrorClientes] = useState('');
  const [errorGestiones, setErrorGestiones] = useState('');
  const { showSuccess } = useToast();

  const recargarDatos = useCallback(async () => {
    const [resultadoClientes, resultadoGestiones, resultadoResumen] = await Promise.allSettled([
      listarClientes(),
      listarGestiones(),
      obtenerResumen(),
    ]);

    setErrorClientes('');
    setErrorGestiones('');
    if (resultadoClientes.status === 'fulfilled') {
      setClientes(resultadoClientes.value);
    } else {
      setClientes([]);
      setErrorClientes('No se pudieron cargar los clientes.');
    }

    if (resultadoGestiones.status === 'fulfilled') {
      setGestiones(resultadoGestiones.value);
    } else {
      setGestiones([]);
      setErrorGestiones('No se pudieron cargar las gestiones.');
    }

    if (resultadoResumen.status === 'fulfilled') setResumen(resultadoResumen.value);
    else setResumen(null);

    setCargandoClientes(false);
    setCargandoGestiones(false);
  }, []);

  useEffect(() => {
    let activo = true;
    Promise.allSettled([listarClientes(), listarGestiones(), obtenerResumen()]).then(([
      resultadoClientes,
      resultadoGestiones,
      resultadoResumen,
    ]) => {
      if (!activo) return;

      if (resultadoClientes.status === 'fulfilled') setClientes(resultadoClientes.value);
      else setErrorClientes('No se pudieron cargar los clientes.');

      if (resultadoGestiones.status === 'fulfilled') setGestiones(resultadoGestiones.value);
      else setErrorGestiones('No se pudieron cargar las gestiones.');

      if (resultadoResumen.status === 'fulfilled') setResumen(resultadoResumen.value);
      setCargandoClientes(false);
      setCargandoGestiones(false);
    });

    return () => { activo = false; };
  }, []);

  async function guardarCliente(datos, clienteId) {
    if (clienteId) await actualizarCliente(clienteId, datos);
    else await crearCliente(datos);
    showSuccess(clienteId ? 'Cliente actualizado.' : 'Cliente creado.');
    await recargarDatos();
  }

  async function borrarClientes(ids) {
    await Promise.all(ids.map(eliminarCliente));
    showSuccess(ids.length === 1 ? 'Cliente eliminado.' : 'Clientes eliminados.');
    await recargarDatos();
  }

  async function agregarGestion(datos) {
    const cliente = clientes.find(item => String(item.id) === String(datos.clienteId));
    if (!cliente) throw new Error('Seleccioná un cliente válido para registrar la gestión.');

    await crearGestion(cliente.id, { ...datos, asesor: cliente.asesor });
    showSuccess('Gestión registrada.');
    await recargarDatos();
  }

  async function editarGestion(datos) {
    await actualizarGestion(datos.clienteId, datos.gestionId, datos);
    showSuccess('Gestión actualizada.');
    await recargarDatos();
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="content-wrapper">
          <Routes>
            <Route path="/clientes" element={<ClientesPage clientes={clientes} resumen={resumen} cargando={cargandoClientes} loadError={errorClientes} onGuardarCliente={guardarCliente} onEliminarClientes={borrarClientes} />} />
            <Route path="/clientes/:clienteId" element={<ClienteDetailPage clientes={clientes} gestiones={gestiones} cargando={cargandoClientes} cargandoGestiones={cargandoGestiones} errorCliente={errorClientes} errorGestiones={errorGestiones} onGuardarCliente={guardarCliente} onAgregarGestion={agregarGestion} onEditarGestion={editarGestion} />} />
            <Route path="/gestiones" element={<GestionesPage clientes={clientes} gestiones={gestiones} cargando={cargandoGestiones} loadError={errorGestiones} onAgregarGestion={agregarGestion} onEditarGestion={editarGestion} />} />
            <Route path="*" element={<Navigate to="/clientes" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
