import { useContext } from 'react'
import { RemindersContext } from '../context/RemindersContext'

function useReminders() {
  const context = useContext(RemindersContext)
  if (context === null) {
    throw new Error('useReminders must be used within a RemindersProvider')
  }
  return context
}

export default useReminders
