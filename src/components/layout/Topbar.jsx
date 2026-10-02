function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" />
    </svg>
  );
}

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <BoltIcon />
        <span>ZOCO CRM</span>
      </div>
      <div className="topbar-right">
        <div className="user-avatar" aria-label="Usuario">CV</div>
      </div>
    </header>
  );
}
