export const ROUTES = {
  DASHBOARD: '/',
  REMINDERS: '/reminders',
  REMINDERS_PENDING: '/reminders/pending',
  REMINDERS_COMPLETED: '/reminders/completed',
  SETTINGS: '/settings',
}

// labelKey es la clave del texto en `nav` de los diccionarios de locales.
export const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, labelKey: 'dashboard' },
  {
    labelKey: 'reminders',
    children: [
      { path: ROUTES.REMINDERS_PENDING, labelKey: 'pending' },
      { path: ROUTES.REMINDERS_COMPLETED, labelKey: 'completed' },
    ],
  },
  { path: ROUTES.SETTINGS, labelKey: 'settings' },
]
