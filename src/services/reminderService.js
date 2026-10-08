import {
  REMINDERS_STORAGE_KEY,
  REMINDER_STATUS,
  SERVICE_ERRORS,
} from '../constants/reminder'
import {
  applyReminderChanges,
  buildReminder,
  changeReminderStatus,
  isValidReminder,
} from '../utils/reminder'
import { isExpiredCompleted } from '../utils/reminderRules'
import { validateReminderInput } from '../utils/reminderValidation'
import storageService from './storageService'

const NOT_FOUND = { ok: false, error: SERVICE_ERRORS.NOT_FOUND }
const STORAGE_FAILURE = { ok: false, error: SERVICE_ERRORS.STORAGE }

// Descarta entradas inválidas y ids repetidos (se conserva la primera): un
// almacenamiento corrupto no debe romper la app. El siguiente guardado no las conserva.
function getAll() {
  const stored = storageService.get(REMINDERS_STORAGE_KEY, [])
  if (!Array.isArray(stored)) return []

  const seenIds = new Set()
  return stored.filter((reminder) => {
    if (!isValidReminder(reminder) || seenIds.has(reminder.id)) return false
    seenIds.add(reminder.id)
    return true
  })
}

function getById(id) {
  return getAll().find((reminder) => reminder.id === id) ?? null
}

function saveAll(reminders) {
  return storageService.set(REMINDERS_STORAGE_KEY, reminders)
}

function saveUpdated(reminders, updated) {
  const next = reminders.map((reminder) =>
    reminder.id === updated.id ? updated : reminder,
  )
  return saveAll(next) ? { ok: true, reminder: updated } : STORAGE_FAILURE
}

// Guardar sin cambiar nada no debe modificar updatedAt.
function hasEditableChanges(current, updated) {
  return (
    current.title !== updated.title ||
    current.description !== updated.description ||
    current.dueDate !== updated.dueDate
  )
}

function create(input) {
  const { isValid, errors } = validateReminderInput(input)
  if (!isValid) {
    return { ok: false, error: SERVICE_ERRORS.VALIDATION, fieldErrors: errors }
  }

  const reminder = buildReminder(input)
  return saveAll([...getAll(), reminder])
    ? { ok: true, reminder }
    : STORAGE_FAILURE
}

function update(id, changes) {
  const reminders = getAll()
  const current = reminders.find((reminder) => reminder.id === id)
  if (!current) return NOT_FOUND

  const { isValid, errors } = validateReminderInput({
    title: current.title,
    description: current.description,
    dueDate: current.dueDate,
    ...changes,
  })
  if (!isValid) {
    return { ok: false, error: SERVICE_ERRORS.VALIDATION, fieldErrors: errors }
  }

  const updated = applyReminderChanges(current, changes)
  if (!hasEditableChanges(current, updated)) return { ok: true, reminder: current }

  return saveUpdated(reminders, updated)
}

function setStatus(id, status) {
  if (!Object.values(REMINDER_STATUS).includes(status)) {
    return { ok: false, error: SERVICE_ERRORS.VALIDATION }
  }

  const reminders = getAll()
  const current = reminders.find((reminder) => reminder.id === id)
  if (!current) return NOT_FOUND

  const updated = changeReminderStatus(current, status)
  if (updated === current) return { ok: true, reminder: current }

  return saveUpdated(reminders, updated)
}

function remove(id) {
  const reminders = getAll()
  if (!reminders.some((reminder) => reminder.id === id)) return NOT_FOUND

  return saveAll(reminders.filter((reminder) => reminder.id !== id))
    ? { ok: true }
    : STORAGE_FAILURE
}

// Elimina los completados que superaron el plazo de permanencia.
// Devuelve cuántos se eliminaron; si no hay ninguno, no escribe nada.
function purgeExpired(now = new Date()) {
  const reminders = getAll()
  const remaining = reminders.filter(
    (reminder) => !isExpiredCompleted(reminder, now),
  )
  const removed = reminders.length - remaining.length
  if (removed === 0) return { ok: true, removed }

  return saveAll(remaining) ? { ok: true, removed } : STORAGE_FAILURE
}

const reminderService = {
  getAll,
  getById,
  create,
  update,
  setStatus,
  delete: remove,
  purgeExpired,
}

export default reminderService
