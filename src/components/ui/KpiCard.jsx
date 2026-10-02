export default function KpiCard({ label, icon, value, sub, subClass }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-label">
        {icon}
        {label}
      </div>
      <div className="kpi-card-value">{value}</div>
      <div className={`kpi-card-sub${subClass ? ' ' + subClass : ''}`}>
        {sub}
      </div>
    </div>
  );
}
