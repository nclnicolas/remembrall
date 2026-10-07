import { useState } from 'react'
import { REMINDER_STATUS, SERVICE_ERRORS } from '../../constants/reminder'
import useTexts from '../../hooks/useTexts'
import { formatDateOnly } from '../../utils/date'
import './ReminderCard.css'

function ReminderCard({ reminder, onStatusChange, onEdit, onDelete }) {
  const texts = useTexts()
  const [hasStatusError, setHasStatusError] = useState(false)
  const isCompleted = reminder.status === REMINDER_STATUS.COMPLETED

  // Pendiente pasa a completado y viceversa. Si sale bien, la card cambia de lista.
  function handleStatusChange() {
    const nextStatus = isCompleted
      ? REMINDER_STATUS.PENDING
      : REMINDER_STATUS.COMPLETED
    const result = onStatusChange(reminder.id, nextStatus)
    setHasStatusError(!result.ok && result.error === SERVICE_ERRORS.STORAGE)
  }

  const statusActionLabel = isCompleted
    ? texts.reminders.reopen
    : texts.reminders.complete

  return (
    <article className="reminder-card">
      <div className="reminder-card-header">
        <h2 className="reminder-card-title">{reminder.title}</h2>
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

      {(onStatusChange || onEdit || onDelete) && (
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
