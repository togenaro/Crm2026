export default function EmptyState({ message, icon: Icon, isError = false }) {
  return (
    <div className="empty-state">
      {Icon && <Icon />}
      <p className={isError ? 'empty-state-error' : ''}>{message}</p>
    </div>
  );
}
