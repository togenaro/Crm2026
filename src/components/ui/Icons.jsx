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

export function IconArrowUpDown(props) {
  return <IconFrame {...props}><path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" /></IconFrame>;
}

export function IconPlus(props) {
  return <IconFrame {...props}><path d="M12 5v14M5 12h14" /></IconFrame>;
}

export function IconUser(props) {
  return <IconFrame {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></IconFrame>;
}

export function IconMail(props) {
  return <IconFrame {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></IconFrame>;
}

export function IconPhone(props) {
  return <IconFrame {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 4.7 12a19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1l-1.2 1a16 16 0 0 0 6 6l1-1a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" /></IconFrame>;
}

export function IconEdit(props) {
  return <IconFrame {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></IconFrame>;
}

export function IconStatus(props) {
  return <IconFrame {...props}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></IconFrame>;
}

export function IconX(props) {
  return <IconFrame {...props}><path d="m18 6-12 12M6 6l12 12" /></IconFrame>;
}
