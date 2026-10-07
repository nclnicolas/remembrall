import { useId, useLayoutEffect, useRef } from 'react'
import './Modal.css'

// Envuelve el <dialog> nativo: aporta foco atrapado, Escape y backdrop sin dependencias.
// El elemento con data-autofocus recibe el foco al abrir.
function Modal({ isOpen, onClose, title, closeLabel, children }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useLayoutEffect(() => {
    const dialog = dialogRef.current

    if (isOpen && !dialog.open) {
      dialog.showModal()
      dialog.querySelector('[data-autofocus]')?.focus()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  // El backdrop es parte del <dialog>: un click directo sobre él cae fuera del contenido.
  function handleClick(event) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleClick}
    >
      <div className="modal-content">
        <header className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            ✕
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}

export default Modal
