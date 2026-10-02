import { useState, useEffect } from 'react';
import KpiGrid from '../components/KpiGrid';
import ClientesTable from '../components/ClientesTable';
import ClienteFormModal from '../components/ClienteFormModal';
import { clienteService } from '../services/clienteService';
import { asesorService } from '../services/asesorService';
import { dashboardService } from '../services/dashboardService';
import { useToast } from '../../../context/ToastContext';

export default function ClientesPage() {
  const { showSuccess } = useToast();
  const [clientes, setClientes] = useState([]);
  const [resumenKpi, setResumenKpi] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5, totalPages: 1, totalItems: 0 });
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [asesor, setAsesor] = useState('');
  const [listaAsesores, setListaAsesores] = useState([]);
  const [clientesError, setClientesError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadAsesores = async () => {
    try {
      const res = await asesorService.getAsesores();
      setListaAsesores(res.map(item => item.nombre));
    } catch (err) {
      console.error('Error obteniendo asesores desde API:', err);
    }
  };

  const loadData = async (page = 1) => {
    setIsLoading(true);
    setClientesError('');
    try {
      const res = await clienteService.getClientes({ page, pageSize: 5, search, estado, asesor });
      setClientes(res.items || []);
      setPagination({
        page: res.page || page,
        pageSize: res.pageSize || 5,
        totalPages: res.totalPages || 1,
        totalItems: res.totalItems || (res.items ? res.items.length : 0),
      });
    } catch (err) {
      console.error('Error cargando clientes desde API:', err);
      setClientes([]);
      setPagination({ page: 1, pageSize: 5, totalPages: 1, totalItems: 0 });
      setClientesError('No se pudieron cargar los clientes.');
    } finally {
      setIsLoading(false);
    }

    try {
      const kpiRes = await dashboardService.getResumen();
      setResumenKpi(kpiRes);
    } catch (err) {
      console.error('Error cargando resumen del dashboard:', err);
      setResumenKpi(null);
    }
  };

  useEffect(() => {
    loadAsesores();
  }, []);

  useEffect(() => {
    loadData(1);
  }, [search, estado, asesor]);

  const handlePageChange = (newPage) => {
    loadData(newPage);
  };

  const handleEliminarClientes = async (ids) => {
    await clienteService.deleteClientes(ids);
    showSuccess(ids.length === 1 ? 'Cliente eliminado.' : 'Clientes eliminados.');
    await loadData(pagination.page);
  };

  const handleAddCliente = async (nuevoCliente) => {
    await clienteService.createCliente(nuevoCliente);
    showSuccess('Cliente creado.');
    setShowClienteModal(false);
    await loadData(1);
  };

  const handleUpdateCliente = async (id, patch) => {
    await clienteService.updateCliente(id, patch);
    showSuccess('Cliente actualizado.');
    await loadData(pagination.page);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
      </div>

      <KpiGrid clientes={clientes} resumen={resumenKpi} />

      <ClientesTable
        clientes={clientes}
        pagination={pagination}
        onPageChange={handlePageChange}
        search={search}
        onSearchChange={setSearch}
        estado={estado}
        onEstadoChange={setEstado}
        asesor={asesor}
        onAsesorChange={setAsesor}
        listaAsesores={listaAsesores}
        loadError={clientesError}
        loading={isLoading}
        onEliminar={handleEliminarClientes}
        onUpdateCliente={handleUpdateCliente}
        onNuevoCliente={() => setShowClienteModal(true)}
      />

      {showClienteModal && (
        <ClienteFormModal
          clientes={clientes}
          listaAsesores={listaAsesores}
          onClose={() => setShowClienteModal(false)}
          onSubmit={handleAddCliente}
        />
      )}
    </>
  );
}
