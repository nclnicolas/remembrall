import { useId, useRef, useState } from 'react'
import { REMINDER_DRAG_TYPE, SERVICE_ERRORS } from '../../constants/reminder'
import useTexts from '../../hooks/useTexts'
import ReminderList from './ReminderList'
import './ReminderColumn.css'

function isReminderDrag(event) {
  return Array.from(event.dataTransfer.types).includes(REMINDER_DRAG_TYPE)
}

// Columna del tablero: lista los recordatorios de un estado y recibe los que se
// arrastran hasta ella (los pasa a `status`). Los botones de la card siguen
// siendo la alternativa al arrastre (teclado, touch).
function ReminderColumn({
  title,
  status,
  reminders,
  emptyMessage,
  onCreate,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const texts = useTexts()
  const titleId = useId()
  const [isDragOver, setIsDragOver] = useState(false)
  const [hasStatusError, setHasStatusError] = useState(false)
  // dragenter/dragleave se disparan también al pasar por los hijos: se cuentan para no parpadear.
  const dragDepth = useRef(0)

  function handleDragEnter(event) {
    if (!isReminderDrag(event)) return
    dragDepth.current += 1
    setIsDragOver(true)
  }

  function handleDragLeave(event) {
    if (!isReminderDrag(event)) return
    dragDepth.current -= 1
    if (dragDepth.current <= 0) {
      dragDepth.current = 0
      setIsDragOver(false)
    }
  }

  function handleDragOver(event) {
    if (!isReminderDrag(event)) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(event) {
    if (!isReminderDrag(event)) return
    event.preventDefault()
    dragDepth.current = 0
    setIsDragOver(false)

    const id = event.dataTransfer.getData(REMINDER_DRAG_TYPE)
    if (!id) return

    const result = onStatusChange(id, status)
    setHasStatusError(!result.ok && result.error === SERVICE_ERRORS.STORAGE)
  }

  return (
    <section
      className={isDragOver ? 'reminder-column is-drag-over' : 'reminder-column'}
      aria-labelledby={titleId}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 id={titleId} className="reminder-column-title">
        {title} ({reminders.length})
      </h2>

      {hasStatusError && (
        <p className="reminder-column-error" role="alert">
          {texts.reminders.statusError}
        </p>
      )}

      <ReminderList
        reminders={reminders}
        emptyMessage={emptyMessage}
        titleTag="h3"
        draggable
        onCreate={onCreate}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  )
}

export default ReminderColumn
