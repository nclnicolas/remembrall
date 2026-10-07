import { REMINDER_STATUS } from '../constants/reminder'
import { isValidDateOnly, isValidTimestamp } from './date'
import { generateId } from './id'

// Deja los campos editables en su forma de almacenamiento: texto sin espacios
// sobrantes y dueDate en null cuando no hay fecha.
export function normalizeReminderInput(input) {
  const source = input ?? {}

  return {
    title: typeof source.title === 'string' ? source.title.trim() : '',
    description:
      typeof source.description === 'string' ? source.description.trim() : '',
    dueDate: source.dueDate ? source.dueDate : null,
  }
}

export function buildReminder(input, now = new Date()) {
  const timestamp = now.toISOString()

  return {
    id: generateId(),
    ...normalizeReminderInput(input),
    status: REMINDER_STATUS.PENDING,
    createdAt: timestamp,
    updatedAt: timestamp,
    completedAt: null,
  }
}

// Solo se pueden modificar title, description y dueDate; el resto se ignora.
export function applyReminderChanges(reminder, changes, now = new Date()) {
  const editableFields = normalizeReminderInput({
    title: reminder.title,
    description: reminder.description,
    dueDate: reminder.dueDate,
    ...changes,
  })

  return { ...reminder, ...editableFields, updatedAt: now.toISOString() }
}

export function changeReminderStatus(reminder, status, now = new Date()) {
  const isKnownStatus = Object.values(REMINDER_STATUS).includes(status)
  if (!isKnownStatus || reminder.status === status) return reminder

  const timestamp = now.toISOString()

  return {
    ...reminder,
    status,
    updatedAt: timestamp,
    completedAt: status === REMINDER_STATUS.COMPLETED ? timestamp : null,
  }
}

// Valida la forma de un recordatorio leído del almacenamiento.
export function isValidReminder(value) {
  if (value === null || typeof value !== 'object') return false

  const isCompleted = value.status === REMINDER_STATUS.COMPLETED
  const isPending = value.status === REMINDER_STATUS.PENDING

  return (
    typeof value.id === 'string' &&
    value.id !== '' &&
    typeof value.title === 'string' &&
    value.title.trim() !== '' &&
    typeof value.description === 'string' &&
    (isCompleted || isPending) &&
    isValidTimestamp(value.createdAt) &&
    isValidTimestamp(value.updatedAt) &&
    (value.dueDate === null || isValidDateOnly(value.dueDate)) &&
    (isCompleted ? isValidTimestamp(value.completedAt) : value.completedAt === null)
  )
}

function compareDesc(a, b) {
  if (a === b) return 0
  return a < b ? 1 : -1
}

// Con fecha estimada primero (la más próxima arriba); sin fecha al final, las más nuevas primero.
export function sortPendingReminders(reminders) {
  return [...reminders].sort((a, b) => {
    if (a.dueDate !== b.dueDate) {
      if (a.dueDate === null) return 1
      if (b.dueDate === null) return -1
      return a.dueDate < b.dueDate ? -1 : 1
    }
    return compareDesc(a.createdAt, b.createdAt)
  })
}

// Los completados más recientemente primero.
export function sortCompletedReminders(reminders) {
  return [...reminders].sort((a, b) =>
    compareDesc(a.completedAt ?? '', b.completedAt ?? ''),
  )
}

// Valores iniciales del formulario: los inputs no aceptan null.
export function reminderToFormValues(reminder) {
  return {
    title: reminder.title,
    description: reminder.description,
    dueDate: reminder.dueDate ?? '',
  }
}
