import KpiCard from '../../../components/ui/KpiCard';
import {
  IconAlertTriangle,
  IconBarChart,
  IconTrendingUp,
  IconUsers,
} from '../../../components/ui/Icons';

export default function KpiGrid({ resumen }) {
  const total = resumen.totalClientes;
  const prospectos = resumen.cantidadProspectos;
  const vencidos = resumen.seguimientosVencidos;

  const cards = [
    { label: 'Total Clientes', icon: <IconUsers />, value: total, sub: 'en el sistema' },
    {
      label: 'Prospectos',
      icon: <IconBarChart />,
      value: prospectos,
      sub: `${Math.round((prospectos / total) * 100)}% del total`,
    },
    {
      label: 'Interesados',
      icon: <IconTrendingUp />,
      value: resumen.cantidadInteresados,
      sub: 'oportunidades activas',
    },
    {
      label: 'Seguimientos vencidos',
      icon: <IconAlertTriangle />,
      value: vencidos,
      sub: vencidos > 0 ? 'requieren atención' : 'sin vencidos',
      subClass: vencidos > 0 ? 'danger' : '',
    },
  ];

  return (
    <section className="kpi-grid" aria-label="Resumen de clientes">
      {cards.map(card => <KpiCard key={card.label} {...card} />)}
    </section>
  );
}
