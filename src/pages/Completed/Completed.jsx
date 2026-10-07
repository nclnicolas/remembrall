import { useOutletContext } from 'react-router-dom'
import ReminderList from '../../components/reminders/ReminderList'
import useReminders from '../../hooks/useReminders'
import useTexts from '../../hooks/useTexts'

function Completed() {
  const texts = useTexts()
  const { completedReminders, setReminderStatus } = useReminders()
  const { onEditReminder, onDeleteReminder } = useOutletContext()

  return (
    <div>
      <h1>Completed</h1>
      <p>Recordatorios completados.</p>
      <ReminderList
        reminders={completedReminders}
        emptyMessage={texts.reminders.emptyCompleted}
        onStatusChange={setReminderStatus}
        onEdit={onEditReminder}
        onDelete={onDeleteReminder}
      />
    </div>
  )
}

export default Completed
