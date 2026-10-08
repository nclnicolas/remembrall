import { useState } from 'react'
import { REMINDER_STATUS, SERVICE_ERRORS } from '../../constants/reminder'
import useTexts from '../../hooks/useTexts'
import { formatDateOnly, formatTimestamp } from '../../utils/date'
import { downloadFile } from '../../utils/download'
import { buildReminderIcs, getIcsFileName } from '../../utils/reminderIcs'
import {
  getExpirationTimestamp,
  getPendingDays,
  needsAttention,
} from '../../utils/reminderRules'
import './ReminderCard.css'

function ReminderCard({
  reminder,
  now = null,
  titleTag: TitleTag = 'h2',
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const texts = useTexts()
  const [hasStatusError, setHasStatusError] = useState(false)
  const isCompleted = reminder.status === REMINDER_STATUS.COMPLETED
  const requiresAttention = now !== null && needsAttention(reminder, now)
  const expirationTimestamp = getExpirationTimestamp(reminder)
  // El evento de calendario necesita fecha estimada; los completados ya no lo requieren.
  const canAddToCalendar = !isCompleted && Boolean(reminder.dueDate)

  // Pendiente pasa a completado y viceversa. Si sale bien, la card cambia de lista.
  function handleStatusChange() {
    const nextStatus = isCompleted
      ? REMINDER_STATUS.PENDING
      : REMINDER_STATUS.COMPLETED
    const result = onStatusChange(reminder.id, nextStatus)
    setHasStatusError(!result.ok && result.error === SERVICE_ERRORS.STORAGE)
  }

  function handleAddToCalendar() {
    const ics = buildReminderIcs(reminder)
    if (ics) downloadFile(ics, getIcsFileName(reminder), 'text/calendar;charset=utf-8')
  }

  const statusActionLabel = isCompleted
    ? texts.reminders.reopen
    : texts.reminders.complete

  return (
    <article
      className={
        requiresAttention ? 'reminder-card needs-attention' : 'reminder-card'
      }
    >
      <div className="reminder-card-header">
        <TitleTag className="reminder-card-title">{reminder.title}</TitleTag>
        <span
          className={
            isCompleted
              ? 'reminder-card-status is-completed'
              : 'reminder-card-status'
          }
        >
          {isCompleted
            ? texts.reminders.statusCompleted
            : texts.reminders.statusPending}
        </span>
      </div>

      {reminder.description && (
        <p className="reminder-card-description">{reminder.description}</p>
      )}

      {reminder.dueDate && (
        <p className="reminder-card-due-date">
          {texts.reminders.dueDate}: {formatDateOnly(reminder.dueDate)}
        </p>
      )}

      {requiresAttention && (
        <p className="reminder-card-attention">
          <span aria-hidden="true">⚠ </span>
          {texts.reminders.attention} ·{' '}
          {texts.reminders.pendingFor(getPendingDays(reminder, now))}
        </p>
      )}

      {isCompleted && reminder.completedAt && (
        <p className="reminder-card-completed-at">
          {texts.reminders.completedAt}: {formatTimestamp(reminder.completedAt)}
        </p>
      )}

      {expirationTimestamp && (
        <p className="reminder-card-expiration">
          {texts.reminders.expiresOn} {formatTimestamp(expirationTimestamp)}
        </p>
      )}

      {(onStatusChange || canAddToCalendar || onEdit || onDelete) && (
        <div className="reminder-card-actions">
          {onStatusChange && (
            <button
              type="button"
              onClick={handleStatusChange}
              aria-label={`${statusActionLabel}: ${reminder.title}`}
            >
              {statusActionLabel}
            </button>
          )}
          {canAddToCalendar && (
            <button
              type="button"
              onClick={handleAddToCalendar}
              aria-label={`${texts.reminders.addToCalendar}: ${reminder.title}`}
            >
              {texts.reminders.addToCalendar}
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(reminder)}
              aria-label={`${texts.reminders.edit}: ${reminder.title}`}
            >
              {texts.reminders.edit}
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="reminder-card-delete"
              onClick={() => onDelete(reminder)}
              aria-label={`${texts.reminders.delete}: ${reminder.title}`}
            >
              {texts.reminders.delete}
            </button>
          )}
        </div>
      )}

      {hasStatusError && (
        <p className="reminder-card-error" role="alert">
          {texts.reminders.statusError}
        </p>
      )}
    </article>
  )
}

export default ReminderCard
