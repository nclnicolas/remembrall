import { useState } from 'react'
import { SERVICE_ERRORS } from '../../constants/reminder'
import useReminders from '../../hooks/useReminders'
import useTexts from '../../hooks/useTexts'
import ConfirmDialog from '../common/ConfirmDialog'
import './ReminderDeleteDialog.css'

// Abierto mientras `reminder` no sea null.
function ReminderDeleteDialog({ reminder, onClose }) {
  const texts = useTexts()
  const { deleteReminder } = useReminders()
  const [hasError, setHasError] = useState(false)

  function handleClose() {
    setHasError(false)
    onClose()
  }

  function handleConfirm() {
    const result = deleteReminder(reminder.id)
    // Si ya no existía, el objetivo se cumplió igual: se cierra sin error.
    if (result.ok || result.error === SERVICE_ERRORS.NOT_FOUND) {
      handleClose()
      return
    }
    setHasError(true)
  }

  return (
    <ConfirmDialog
      isOpen={reminder !== null}
      title={texts.deleteDialog.title}
      message={texts.deleteDialog.message}
      confirmLabel={texts.reminders.delete}
      error={hasError ? texts.deleteDialog.error : null}
      onConfirm={handleConfirm}
      onCancel={handleClose}
    >
      <p className="reminder-delete-subject">{reminder?.title}</p>
    </ConfirmDialog>
  )
}

export default ReminderDeleteDialog
