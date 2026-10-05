export const ROUTES = {
  DASHBOARD: '/',
  REMINDERS: '/reminders',
  REMINDERS_PENDING: '/reminders/pending',
  REMINDERS_COMPLETED: '/reminders/completed',
  SETTINGS: '/settings',
}

export const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard' },
  {
    label: 'Reminders',
    children: [
      { path: ROUTES.REMINDERS_PENDING, label: 'Pending' },
      { path: ROUTES.REMINDERS_COMPLETED, label: 'Completed' },
    ],
  },
  { path: ROUTES.SETTINGS, label: 'Settings' },
]
