import { useCallback, useEffect, useMemo, useState } from 'react'
import { REMINDER_STATUS, SERVICE_ERRORS } from '../constants/reminder'
import reminderService from '../services/reminderService'
import {
  sortCompletedReminders,
  sortPendingReminders,
} from '../utils/reminder'
import { RemindersContext } from './RemindersContext'

function RemindersProvider({ children }) {
  const [reminders, setReminders] = useState(() => reminderService.getAll())
  // Hora de referencia de las reglas de tiempo; se refresca al volver a la pestaña.
  const [now, setNow] = useState(() => new Date())
  const [purgedCount, setPurgedCount] = useState(0)

  // Elimina los completados vencidos y avisa cuántos fueron. Si falla el guardado,
  // no se informa nada y se reintenta la próxima vez.
  const refreshTimeRules = useCallback(() => {
    const currentTime = new Date()
    setNow(currentTime)

    const result = reminderService.purgeExpired(currentTime)
    if (result.ok && result.removed > 0) {
      setReminders(reminderService.getAll())
      setPurgedCount((count) => count + result.removed)
    }
  }, [])

  useEffect(() => {
    refreshTimeRules()

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') refreshTimeRules()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [refreshTimeRules])

  const dismissPurgeNotice = useCallback(() => setPurgedCount(0), [])

  // Devuelve el resultado del servicio ({ ok, ... }) para que la UI muestre errores.
  const addReminder = useCallback((input) => {
    const result = reminderService.create(input)
    if (result.ok) setReminders(reminderService.getAll())
    return result
  }, [])

  // Si el recordatorio ya no existe también se relee la lista para reflejarlo.
  const updateReminder = useCallback((id, changes) => {
    const result = reminderService.update(id, changes)
    if (result.ok || result.error === SERVICE_ERRORS.NOT_FOUND) {
      setReminders(reminderService.getAll())
    }
    return result
  }, [])

  // Eliminar un recordatorio que ya no existe también se refleja releyendo la lista.
  const deleteReminder = useCallback((id) => {
    const result = reminderService.delete(id)
    if (result.ok || result.error === SERVICE_ERRORS.NOT_FOUND) {
      setReminders(reminderService.getAll())
    }
    return result
  }, [])

  // Si el recordatorio ya no existe también se relee la lista para reflejarlo.
  const setReminderStatus = useCallback((id, status) => {
    const result = reminderService.setStatus(id, status)
    if (result.ok || result.error === SERVICE_ERRORS.NOT_FOUND) {
      setReminders(reminderService.getAll())
    }
    return result
  }, [])

  const value = useMemo(
    () => ({
      pendingReminders: sortPendingReminders(
        reminders.filter((reminder) => reminder.status === REMINDER_STATUS.PENDING),
      ),
      completedReminders: sortCompletedReminders(
        reminders.filter((reminder) => reminder.status === REMINDER_STATUS.COMPLETED),
      ),
      now,
      purgedCount,
      dismissPurgeNotice,
      addReminder,
      updateReminder,
      deleteReminder,
      setReminderStatus,
    }),
    [
      reminders,
      now,
      purgedCount,
      dismissPurgeNotice,
      addReminder,
      updateReminder,
      deleteReminder,
      setReminderStatus,
    ],
  )

  return (
    <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>
  )
}

export default RemindersProvider
