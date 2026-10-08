import useReminders from '../../hooks/useReminders'
import useTexts from '../../hooks/useTexts'
import { downloadFile } from '../../utils/download'
import { buildRemindersCsv, getCsvFileName } from '../../utils/reminderCsv'
import './DataExport.css'

function DataExport() {
  const texts = useTexts()
  const { pendingReminders, completedReminders } = useReminders()
  const reminders = [...pendingReminders, ...completedReminders]
  const isEmpty = reminders.length === 0

  function handleExport() {
    const csv = buildRemindersCsv(reminders, {
      headers: texts.data.headers,
      statusLabels: {
        pending: texts.reminders.statusPending,
        completed: texts.reminders.statusCompleted,
      },
    })
    downloadFile(
      csv,
      getCsvFileName(new Date(), texts.data.fileNamePrefix),
      'text/csv;charset=utf-8',
    )
  }

  return (
    <div className="data-export">
      <button type="button" onClick={handleExport} disabled={isEmpty}>
        {texts.data.exportButton}
      </button>
      {isEmpty && <p className="data-export-empty">{texts.data.exportEmpty}</p>}
    </div>
  )
}

export default DataExport
