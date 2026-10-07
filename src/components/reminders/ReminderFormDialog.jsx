import useReminders from '../../hooks/useReminders'
import useTexts from '../../hooks/useTexts'
import { reminderToFormValues } from '../../utils/reminder'
import Modal from '../common/Modal'
import ReminderForm from './ReminderForm'

// Sin `reminder` crea uno nuevo; con `reminder` edita ese recordatorio.
function ReminderFormDialog({ isOpen, onClose, reminder = null }) {
  const texts = useTexts()
  const { addReminder, updateReminder } = useReminders()
  const isEditing = reminder !== null

  function handleSubmit(values) {
    const result = isEditing
      ? updateReminder(reminder.id, values)
      : addReminder(values)
    if (result.ok) onClose()
    return result
  }

  // El formulario solo existe mientras el diálogo está abierto: cada apertura carga valores frescos.
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? texts.form.editTitle : texts.form.createTitle}
      closeLabel={texts.common.close}
    >
      {isOpen && (
        <ReminderForm
          initialValues={isEditing ? reminderToFormValues(reminder) : undefined}
          submitLabel={isEditing ? texts.form.editSubmit : texts.form.createSubmit}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      )}
    </Modal>
  )
}

export default ReminderFormDialog
