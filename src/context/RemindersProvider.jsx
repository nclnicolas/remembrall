import { useCallback, useMemo, useState } from 'react'
import { REMINDER_STATUS, SERVICE_ERRORS } from '../constants/reminder'
import reminderService from '../services/reminderService'
import {
  sortCompletedReminders,
  sortPendingReminders,
} from '../utils/reminder'
import { RemindersContext } from './RemindersContext'

function RemindersProvider({ children }) {
  const [reminders, setReminders] = useState(() => reminderService.getAll())

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
      addReminder,
      updateReminder,
      deleteReminder,
      setReminderStatus,
    }),
    [reminders, addReminder, updateReminder, deleteReminder, setReminderStatus],
  )

  return (
    <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>
  )
}

export default RemindersProvider
