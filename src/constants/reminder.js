export const REMINDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
}

export const REMINDER_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
}

// Errores de validación por campo. La UI los traduce a texto.
export const FIELD_ERRORS = {
  REQUIRED: 'required',
  TOO_LONG: 'tooLong',
  INVALID_DATE: 'invalidDate',
}

// Errores de las operaciones de reminderService.
export const SERVICE_ERRORS = {
  VALIDATION: 'validation',
  NOT_FOUND: 'notFound',
  STORAGE: 'storage',
}

export const REMINDERS_STORAGE_KEY = 'remembrall.reminders'

// Tipo de dato con el que se arrastra un recordatorio entre columnas del Dashboard.
export const REMINDER_DRAG_TYPE = 'application/x-remembrall-reminder-id'

// Un pendiente requiere atención a los 3 días de su creación (reloj de 24 h por día).
export const ATTENTION_AFTER_DAYS = 3

// Los completados se conservan 30 días desde que se completaron.
export const COMPLETED_RETENTION_DAYS = 30
