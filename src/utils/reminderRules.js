import {
  ATTENTION_AFTER_DAYS,
  COMPLETED_RETENTION_DAYS,
  REMINDER_STATUS,
} from '../constants/reminder'

const DAY_MS = 24 * 60 * 60 * 1000

// Milisegundos transcurridos desde `timestamp`. NaN si no es una fecha válida;
// negativo si está en el futuro (reloj desfasado). Ambos casos no disparan reglas.
function elapsedSince(timestamp, now) {
  return now.getTime() - Date.parse(timestamp)
}

// Días completos que lleva pendiente un recordatorio (0 si la fecha es inválida o futura).
export function getPendingDays(reminder, now) {
  const elapsed = elapsedSince(reminder.createdAt, now)
  return elapsed > 0 ? Math.floor(elapsed / DAY_MS) : 0
}

// Solo aplica a pendientes: pasaron ATTENTION_AFTER_DAYS desde su creación.
export function needsAttention(reminder, now) {
  return (
    reminder.status === REMINDER_STATUS.PENDING &&
    elapsedSince(reminder.createdAt, now) >= ATTENTION_AFTER_DAYS * DAY_MS
  )
}

// Solo aplica a completados: pasaron COMPLETED_RETENTION_DAYS desde que se completaron.
export function isExpiredCompleted(reminder, now) {
  return (
    reminder.status === REMINDER_STATUS.COMPLETED &&
    elapsedSince(reminder.completedAt, now) >= COMPLETED_RETENTION_DAYS * DAY_MS
  )
}

// Cuándo se eliminará un completado (string ISO), o null si no corresponde.
export function getExpirationTimestamp(reminder) {
  const completedAt = Date.parse(reminder.completedAt)
  if (reminder.status !== REMINDER_STATUS.COMPLETED || Number.isNaN(completedAt)) {
    return null
  }
  return new Date(completedAt + COMPLETED_RETENTION_DAYS * DAY_MS).toISOString()
}
