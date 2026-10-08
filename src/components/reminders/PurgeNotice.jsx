import useReminders from '../../hooks/useReminders'
import useTexts from '../../hooks/useTexts'
import './PurgeNotice.css'

// Avisa cuando se eliminaron completados que superaron el plazo de permanencia.
function PurgeNotice() {
  const texts = useTexts()
  const { purgedCount, dismissPurgeNotice } = useReminders()

  if (purgedCount === 0) return null

  return (
    <div className="purge-notice" role="status">
      <p>{texts.retention.purgedNotice(purgedCount)}</p>
      <button
        type="button"
        onClick={dismissPurgeNotice}
        aria-label={texts.common.close}
      >
        ✕
      </button>
    </div>
  )
}

export default PurgeNotice
