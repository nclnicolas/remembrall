import { useOutletContext } from 'react-router-dom'
import ReminderColumn from '../../components/reminders/ReminderColumn'
import { REMINDER_STATUS } from '../../constants/reminder'
import useReminders from '../../hooks/useReminders'
import useTexts from '../../hooks/useTexts'
import './Dashboard.css'

function Dashboard() {
  const texts = useTexts()
  const { pendingReminders, completedReminders, setReminderStatus } =
    useReminders()
  const { onCreateReminder, onEditReminder, onDeleteReminder } =
    useOutletContext()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{texts.dashboard.intro}</p>

      <div className="dashboard-board">
        <ReminderColumn
          title={texts.dashboard.pendingTitle}
          status={REMINDER_STATUS.PENDING}
          reminders={pendingReminders}
          emptyMessage={texts.reminders.emptyPending}
          onCreate={onCreateReminder}
          onStatusChange={setReminderStatus}
          onEdit={onEditReminder}
          onDelete={onDeleteReminder}
        />
        <ReminderColumn
          title={texts.dashboard.completedTitle}
          status={REMINDER_STATUS.COMPLETED}
          reminders={completedReminders}
          emptyMessage={texts.reminders.emptyCompleted}
          onStatusChange={setReminderStatus}
          onEdit={onEditReminder}
          onDelete={onDeleteReminder}
        />
      </div>
    </div>
  )
}

export default Dashboard
