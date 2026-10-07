import useTexts from '../../hooks/useTexts'
import ReminderCard from './ReminderCard'
import './ReminderList.css'

// onCreate, onStatusChange, onEdit y onDelete son opcionales.
// Si existe onCreate, el estado vacío ofrece crear un recordatorio.
function ReminderList({
  reminders,
  emptyMessage,
  onCreate,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const texts = useTexts()

  if (reminders.length === 0) {
    return (
      <div className="reminder-empty">
        <p>{emptyMessage}</p>
        {onCreate && (
          <button type="button" onClick={onCreate}>
            {texts.reminders.create}
          </button>
        )}
      </div>
    )
  }

  return (
    <ul className="reminder-list">
      {reminders.map((reminder) => (
        <li key={reminder.id}>
          <ReminderCard
            reminder={reminder}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}

export default ReminderList
