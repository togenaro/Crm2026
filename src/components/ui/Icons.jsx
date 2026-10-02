function IconFrame({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconUsers(props) {
  return <IconFrame {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></IconFrame>;
}

export function IconTrendingUp(props) {
  return <IconFrame {...props}><path d="m22 7-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></IconFrame>;
}

export function IconAlertTriangle(props) {
  return <IconFrame {...props}><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></IconFrame>;
}

export function IconBarChart(props) {
  return <IconFrame {...props}><path d="M3 3v18h18" /><path d="M18 17V9m-5 8V5m-5 12v-3" /></IconFrame>;
}

export function IconSearch(props) {
  return <IconFrame {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></IconFrame>;
}

export function IconCalendar(props) {
  return <IconFrame {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></IconFrame>;
}

export function IconChevronUp(props) {
  return <IconFrame {...props}><path d="m18 15-6-6-6 6" /></IconFrame>;
}

export function IconChevronDown(props) {
  return <IconFrame {...props}><path d="m6 9 6 6 6-6" /></IconFrame>;
}
