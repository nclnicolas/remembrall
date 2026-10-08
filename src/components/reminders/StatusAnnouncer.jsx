import { useEffect } from 'react'
import { REMINDER_STATUS } from '../../constants/reminder'
import useReminders from '../../hooks/useReminders'
import useTexts from '../../hooks/useTexts'
import './StatusAnnouncer.css'

const CLEAR_AFTER_MS = 3000

// Región en vivo, oculta a la vista, que anuncia a los lectores de pantalla cuando un
// recordatorio cambia de estado (la card desaparece de la lista y el foco se pierde).
function StatusAnnouncer() {
  const texts = useTexts()
  const { statusAnnouncement, clearStatusAnnouncement } = useReminders()

  // Se borra el mensaje ya anunciado para que un cambio posterior (ej. de idioma) no lo repita.
  useEffect(() => {
    if (statusAnnouncement === null) return
    const timeoutId = setTimeout(clearStatusAnnouncement, CLEAR_AFTER_MS)
    return () => clearTimeout(timeoutId)
  }, [statusAnnouncement, clearStatusAnnouncement])

  let message = ''
  if (statusAnnouncement !== null) {
    message =
      statusAnnouncement.status === REMINDER_STATUS.COMPLETED
        ? texts.announcements.completed(statusAnnouncement.title)
        : texts.announcements.reopened(statusAnnouncement.title)
  }

  return (
    <div
      className="status-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  )
}

export default StatusAnnouncer
