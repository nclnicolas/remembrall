import { useId, useState } from 'react'
import {
  FIELD_ERRORS,
  REMINDER_LIMITS,
  SERVICE_ERRORS,
} from '../../constants/reminder'
import useTexts from '../../hooks/useTexts'
import './ReminderForm.css'

const EMPTY_VALUES = { title: '', description: '', dueDate: '' }

const FIELD_MAX_LENGTH = {
  title: REMINDER_LIMITS.TITLE_MAX_LENGTH,
  description: REMINDER_LIMITS.DESCRIPTION_MAX_LENGTH,
}

// onSubmit(values) debe devolver el resultado del servicio ({ ok, error, fieldErrors }).
// La validación vive en el servicio; el formulario solo muestra sus errores.
function ReminderForm({
  initialValues = EMPTY_VALUES,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const texts = useTexts()
  const formId = useId()
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)

  function getErrorMessage(field) {
    const code = fieldErrors[field]
    if (!code) return null
    if (code === FIELD_ERRORS.TOO_LONG) {
      return texts.form.errors.tooLong(FIELD_MAX_LENGTH[field])
    }
    return texts.form.errors[code]
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: undefined }))
    setFormError(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = onSubmit(values)
    if (result.ok) return

    setFieldErrors(result.fieldErrors ?? {})
    setFormError(
      result.error === SERVICE_ERRORS.VALIDATION ? null : result.error,
    )
  }

  const titleError = getErrorMessage('title')
  const descriptionError = getErrorMessage('description')
  const dueDateError = getErrorMessage('dueDate')

  return (
    <form className="reminder-form" onSubmit={handleSubmit} noValidate>
      <div className="reminder-form-field">
        <label htmlFor={`${formId}-title`}>{texts.form.title}</label>
        <input
          id={`${formId}-title`}
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? `${formId}-title-error` : undefined}
          data-autofocus
        />
        {titleError && (
          <p id={`${formId}-title-error`} className="reminder-form-error" role="alert">
            {titleError}
          </p>
        )}
      </div>

      <div className="reminder-form-field">
        <label htmlFor={`${formId}-description`}>
          {texts.form.description}{' '}
          <span className="reminder-form-optional">{texts.form.optional}</span>
        </label>
        <textarea
          id={`${formId}-description`}
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          aria-invalid={Boolean(descriptionError)}
          aria-describedby={
            descriptionError ? `${formId}-description-error` : undefined
          }
        />
        {descriptionError && (
          <p
            id={`${formId}-description-error`}
            className="reminder-form-error"
            role="alert"
          >
            {descriptionError}
          </p>
        )}
      </div>

      <div className="reminder-form-field">
        <label htmlFor={`${formId}-dueDate`}>
          {texts.form.dueDate}{' '}
          <span className="reminder-form-optional">{texts.form.optional}</span>
        </label>
        <input
          id={`${formId}-dueDate`}
          name="dueDate"
          type="date"
          value={values.dueDate}
          onChange={handleChange}
          aria-invalid={Boolean(dueDateError)}
          aria-describedby={dueDateError ? `${formId}-dueDate-error` : undefined}
        />
        {dueDateError && (
          <p
            id={`${formId}-dueDate-error`}
            className="reminder-form-error"
            role="alert"
          >
            {dueDateError}
          </p>
        )}
      </div>

      {formError && (
        <p className="reminder-form-error" role="alert">
          {formError === SERVICE_ERRORS.NOT_FOUND
            ? texts.form.notFoundError
            : texts.form.saveError}
        </p>
      )}

      <div className="reminder-form-actions">
        <button type="button" onClick={onCancel}>
          {texts.common.cancel}
        </button>
        <button type="submit" className="reminder-form-submit">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ReminderForm
