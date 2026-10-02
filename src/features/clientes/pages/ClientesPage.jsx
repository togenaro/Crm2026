import KpiGrid from '../components/KpiGrid';
import ClientesTable from '../components/ClientesTable';
import { clientesDemo, resumenClientesDemo } from '../data/clientesDemo';

export default function ClientesPage() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Clientes</h1>
      </header>

      <KpiGrid resumen={resumenClientesDemo} />
      <ClientesTable clientes={clientesDemo} totalClientes={resumenClientesDemo.totalClientes} />
    </>
  );
}
