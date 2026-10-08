import { REMINDER_DRAG_TYPE } from '../../constants/reminder'
import useTexts from '../../hooks/useTexts'
import ReminderCard from './ReminderCard'
import './ReminderList.css'

// onCreate, onStatusChange, onEdit y onDelete son opcionales.
// Si existe onCreate, el estado vacío ofrece crear un recordatorio.
// Con draggable, cada card se puede arrastrar (la columna destino recibe el id).
function ReminderList({
  reminders,
  emptyMessage,
  titleTag,
  draggable = false,
  onCreate,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const texts = useTexts()

  function handleDragStart(event, reminder) {
    const item = event.currentTarget
    event.dataTransfer.setData(REMINDER_DRAG_TYPE, reminder.id)
    event.dataTransfer.effectAllowed = 'move'
    // Se atenúa después del arranque: si se hace antes, la imagen del arrastre sale atenuada.
    setTimeout(() => item.classList.add('is-dragging'), 0)
  }

  function handleDragEnd(event) {
    event.currentTarget.classList.remove('is-dragging')
  }

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
        <li
          key={reminder.id}
          className={draggable ? 'reminder-list-item is-draggable' : undefined}
          draggable={draggable ? true : undefined}
          onDragStart={draggable ? (event) => handleDragStart(event, reminder) : undefined}
          onDragEnd={draggable ? handleDragEnd : undefined}
        >
          <ReminderCard
            reminder={reminder}
            titleTag={titleTag}
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
