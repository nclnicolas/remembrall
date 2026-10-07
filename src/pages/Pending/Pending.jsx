import { useOutletContext } from 'react-router-dom'
import ReminderList from '../../components/reminders/ReminderList'
import useReminders from '../../hooks/useReminders'
import useTexts from '../../hooks/useTexts'

function Pending() {
  const texts = useTexts()
  const { pendingReminders, setReminderStatus } = useReminders()
  const { onCreateReminder, onEditReminder, onDeleteReminder } =
    useOutletContext()

  return (
    <div>
      <h1>Pending</h1>
      <p>Recordatorios pendientes.</p>
      <ReminderList
        reminders={pendingReminders}
        emptyMessage={texts.reminders.emptyPending}
        onCreate={onCreateReminder}
        onStatusChange={setReminderStatus}
        onEdit={onEditReminder}
        onDelete={onDeleteReminder}
      />
    </div>
  )
}

export default Pending
