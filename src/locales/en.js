import { COMPLETED_RETENTION_DAYS } from '../constants/reminder'

// UI texts in English. Must keep exactly the same structure as locales/es.js
// (a test checks it).
const en = {
  common: {
    close: 'Close',
    cancel: 'Cancel',
  },
  nav: {
    dashboard: 'Dashboard',
    reminders: 'Reminders',
    pending: 'Pending',
    completed: 'Completed',
    settings: 'Settings',
    newReminder: '+ New Reminder',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  pages: {
    pending: {
      title: 'Pending',
      description: 'Pending reminders.',
    },
    completed: {
      title: 'Completed',
      description: 'Completed reminders.',
    },
    notFound: {
      title: '404',
      message: 'The page you are looking for does not exist.',
    },
  },
  settings: {
    title: 'Settings',
    description: 'Remembrall settings.',
    appearanceTitle: 'Appearance',
    themeLabel: 'Theme',
    themes: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    languageTitle: 'Language',
    languageLabel: 'Interface language',
  },
  reminders: {
    create: 'Create reminder',
    emptyPending: "You don't have any pending reminders yet.",
    emptyCompleted: "You don't have any completed reminders yet.",
    dueDate: 'Due date',
    statusPending: 'Pending',
    statusCompleted: 'Completed',
    edit: 'Edit',
    delete: 'Delete',
    completedAt: 'Completed',
    expiresOn: 'Will be deleted on',
    attention: 'Needs attention',
    pendingFor: (days) => `Pending for ${days} ${days === 1 ? 'day' : 'days'}`,
    complete: 'Complete',
    reopen: 'Mark as pending',
    statusError:
      'Could not change the status. Check that your browser allows saving data and try again.',
  },
  retention: {
    purgedNotice: (count) =>
      count === 1
        ? `1 completed reminder older than ${COMPLETED_RETENTION_DAYS} days was deleted.`
        : `${count} completed reminders older than ${COMPLETED_RETENTION_DAYS} days were deleted.`,
  },
  dashboard: {
    title: 'Dashboard',
    intro: 'Create your reminders and organize your work.',
    pendingTitle: 'Pending',
    completedTitle: 'Completed',
  },
  deleteDialog: {
    title: 'Delete reminder?',
    message: 'This action cannot be undone.',
    error:
      'Could not delete the reminder. Check that your browser allows saving data and try again.',
  },
  form: {
    createTitle: 'New reminder',
    createSubmit: 'Create reminder',
    editTitle: 'Edit reminder',
    editSubmit: 'Save changes',
    title: 'Title',
    description: 'Description',
    dueDate: 'Due date',
    optional: '(optional)',
    saveError:
      'Could not save the reminder. Check that your browser allows saving data and try again.',
    notFoundError: 'This reminder no longer exists.',
    errors: {
      required: 'This field is required.',
      tooLong: (max) => `Maximum ${max} characters.`,
      invalidDate: 'Enter a valid date.',
    },
  },
}

export default en
