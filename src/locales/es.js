// Textos de la UI de recordatorios en español (idioma por defecto).
// El selector de idioma y la versión en inglés llegan en la Fase 5.
const es = {
  common: {
    close: 'Cerrar',
    cancel: 'Cancelar',
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
    complete: 'Completar',
    reopen: 'Volver a pendiente',
    statusError:
      'No se pudo cambiar el estado. Revisá que el navegador permita guardar datos e intentá de nuevo.',
  },
  dashboard: {
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
