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
