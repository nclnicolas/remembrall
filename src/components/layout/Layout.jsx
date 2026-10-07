import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import ReminderDeleteDialog from '../reminders/ReminderDeleteDialog'
import ReminderFormDialog from '../reminders/ReminderFormDialog'
import MobileHeader from './MobileHeader'
import Sidebar from './Sidebar'
import Footer from './Footer'
import './Layout.css'

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // reminder: null al crear, el recordatorio a modificar al editar.
  const [reminderForm, setReminderForm] = useState({ isOpen: false, reminder: null })

  // Recordatorio pendiente de confirmar su eliminación (null = diálogo cerrado).
  const [reminderToDelete, setReminderToDelete] = useState(null)

  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)
  const openReminderForm = () => setReminderForm({ isOpen: true, reminder: null })
  const editReminder = (reminder) => setReminderForm({ isOpen: true, reminder })
  const closeDeleteDialog = () => setReminderToDelete(null)
  const closeReminderForm = () => setReminderForm({ isOpen: false, reminder: null })

  useEffect(() => {
    if (!isMenuOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <div className={isMenuOpen ? 'layout menu-open' : 'layout'}>
      <Sidebar
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onCreateReminder={openReminderForm}
      />
      {isMenuOpen && (
        <div
          className="layout-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      <div className="layout-content">
        <MobileHeader isMenuOpen={isMenuOpen} onMenuClick={openMenu} />
        <main className="layout-main">
          <Outlet
            context={{
              onCreateReminder: openReminderForm,
              onEditReminder: editReminder,
              onDeleteReminder: setReminderToDelete,
            }}
          />
        </main>
        <Footer />
      </div>
      <ReminderFormDialog
        isOpen={reminderForm.isOpen}
        reminder={reminderForm.reminder}
        onClose={closeReminderForm}
      />
      <ReminderDeleteDialog
        reminder={reminderToDelete}
        onClose={closeDeleteDialog}
      />
    </div>
  )
}

export default Layout
