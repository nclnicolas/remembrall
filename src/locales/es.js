import { COMPLETED_RETENTION_DAYS } from '../constants/reminder'

// Textos de la interfaz en español (idioma por defecto).
// locales/en.js debe mantener exactamente la misma estructura (lo verifica un test).
const es = {
  common: {
    close: 'Cerrar',
    cancel: 'Cancelar',
  },
  nav: {
    dashboard: 'Dashboard',
    reminders: 'Recordatorios',
    pending: 'Pendientes',
    completed: 'Completados',
    settings: 'Configuración',
    newReminder: '+ Nuevo recordatorio',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  pages: {
    pending: {
      title: 'Pendientes',
      description: 'Recordatorios pendientes.',
    },
    completed: {
      title: 'Completados',
      description: 'Recordatorios completados.',
    },
    notFound: {
      title: '404',
      message: 'La página que buscás no existe.',
    },
  },
  settings: {
    title: 'Configuración',
    description: 'Configuración de Remembrall.',
    appearanceTitle: 'Apariencia',
    themeLabel: 'Tema',
    themes: {
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
    },
    languageTitle: 'Idioma',
    languageLabel: 'Idioma de la interfaz',
    dataTitle: 'Datos',
  },
  data: {
    exportButton: 'Exportar recordatorios (CSV)',
    exportEmpty: 'No hay recordatorios para exportar.',
    fileNamePrefix: 'remembrall-recordatorios',
    headers: {
      title: 'Título',
      description: 'Descripción',
      dueDate: 'Fecha estimada',
      status: 'Estado',
    },
  },
  reminders: {
    create: 'Crear recordatorio',
    emptyPending: 'Todavía no tenés recordatorios pendientes.',
    emptyCompleted: 'Todavía no tenés recordatorios completados.',
    dueDate: 'Fecha estimada',
    statusPending: 'Pendiente',
    statusCompleted: 'Completado',
    edit: 'Editar',
    delete: 'Eliminar',
    completedAt: 'Completado',
    expiresOn: 'Se elimina el',
    attention: 'Requiere atención',
    pendingFor: (days) =>
      `Pendiente hace ${days} ${days === 1 ? 'día' : 'días'}`,
    complete: 'Completar',
    addToCalendar: 'Agregar al calendario',
    reopen: 'Volver a pendiente',
    statusError:
      'No se pudo cambiar el estado. Revisá que el navegador permita guardar datos e intentá de nuevo.',
  },
  retention: {
    purgedNotice: (count) =>
      count === 1
        ? `Se eliminó 1 recordatorio completado hace más de ${COMPLETED_RETENTION_DAYS} días.`
        : `Se eliminaron ${count} recordatorios completados hace más de ${COMPLETED_RETENTION_DAYS} días.`,
  },
  dashboard: {
    title: 'Dashboard',
    intro: 'Creá tus recordatorios y organizá tu trabajo.',
    pendingTitle: 'Pendientes',
    completedTitle: 'Completados',
  },
  deleteDialog: {
    title: '¿Eliminar recordatorio?',
    message: 'Esta acción no se puede deshacer.',
    error:
      'No se pudo eliminar el recordatorio. Revisá que el navegador permita guardar datos e intentá de nuevo.',
  },
  form: {
    createTitle: 'Nuevo recordatorio',
    createSubmit: 'Crear recordatorio',
    editTitle: 'Editar recordatorio',
    editSubmit: 'Guardar cambios',
    title: 'Título',
    description: 'Descripción',
    dueDate: 'Fecha estimada',
    optional: '(opcional)',
    saveError:
      'No se pudo guardar el recordatorio. Revisá que el navegador permita guardar datos e intentá de nuevo.',
    notFoundError: 'Este recordatorio ya no existe.',
    errors: {
      required: 'Este campo es obligatorio.',
      tooLong: (max) => `Máximo ${max} caracteres.`,
      invalidDate: 'Ingresá una fecha válida.',
    },
  },
}

export default es
