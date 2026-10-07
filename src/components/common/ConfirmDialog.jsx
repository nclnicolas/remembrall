import useTexts from '../../hooks/useTexts'
import Modal from './Modal'
import './ConfirmDialog.css'

// Confirmación de acciones destructivas. El foco inicial queda en "Cancelar".
// children muestra contexto adicional (qué se va a afectar); error, un mensaje de fallo.
function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  error,
  onConfirm,
  onCancel,
  children,
}) {
  const texts = useTexts()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      closeLabel={texts.common.close}
    >
      {isOpen && (
        <div className="confirm-dialog">
          <p className="confirm-dialog-message">{message}</p>
          {children}
          {error && (
            <p className="confirm-dialog-error" role="alert">
              {error}
            </p>
          )}
          <div className="confirm-dialog-actions">
            <button type="button" onClick={onCancel} data-autofocus>
              {texts.common.cancel}
            </button>
            <button
              type="button"
              className="confirm-dialog-confirm"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ConfirmDialog
