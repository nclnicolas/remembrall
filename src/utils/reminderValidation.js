import { FIELD_ERRORS, REMINDER_LIMITS } from '../constants/reminder'
import { isValidDateOnly } from './date'
import { normalizeReminderInput } from './reminder'

export function validateReminderInput(input) {
  const { title, description, dueDate } = normalizeReminderInput(input)
  const errors = {}

  if (title === '') {
    errors.title = FIELD_ERRORS.REQUIRED
  } else if (title.length > REMINDER_LIMITS.TITLE_MAX_LENGTH) {
    errors.title = FIELD_ERRORS.TOO_LONG
  }

  if (description.length > REMINDER_LIMITS.DESCRIPTION_MAX_LENGTH) {
    errors.description = FIELD_ERRORS.TOO_LONG
  }

  if (dueDate !== null && !isValidDateOnly(dueDate)) {
    errors.dueDate = FIELD_ERRORS.INVALID_DATE
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
