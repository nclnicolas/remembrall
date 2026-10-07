import { describe, expect, it } from 'vitest'
import { REMINDER_LIMITS } from '../constants/reminder'
import { validateReminderInput } from './reminderValidation'

describe('validateReminderInput', () => {
  it('acepta solo el título', () => {
    expect(validateReminderInput({ title: 'Pagar luz' })).toEqual({
      isValid: true,
      errors: {},
    })
  })

  it('acepta título, descripción y fecha válidos', () => {
    const result = validateReminderInput({
      title: 'Pagar luz',
      description: 'Vence pronto',
      dueDate: '2026-09-15',
    })
    expect(result.isValid).toBe(true)
  })

  it('exige título y no acepta solo espacios', () => {
    expect(validateReminderInput({ title: '' }).errors.title).toBe('required')
    expect(validateReminderInput({ title: '   ' }).errors.title).toBe('required')
    expect(validateReminderInput({}).errors.title).toBe('required')
  })

  it('valida el largo máximo del título y la descripción', () => {
    const longTitle = 'a'.repeat(REMINDER_LIMITS.TITLE_MAX_LENGTH + 1)
    const longDescription = 'a'.repeat(REMINDER_LIMITS.DESCRIPTION_MAX_LENGTH + 1)
    const result = validateReminderInput({
      title: longTitle,
      description: longDescription,
    })
    expect(result.errors).toEqual({ title: 'tooLong', description: 'tooLong' })
  })

  it('acepta exactamente el largo máximo', () => {
    const result = validateReminderInput({
      title: 'a'.repeat(REMINDER_LIMITS.TITLE_MAX_LENGTH),
      description: 'a'.repeat(REMINDER_LIMITS.DESCRIPTION_MAX_LENGTH),
    })
    expect(result.isValid).toBe(true)
  })

  it('rechaza fechas inválidas y acepta fecha vacía', () => {
    expect(
      validateReminderInput({ title: 'x', dueDate: '2026-02-30' }).errors.dueDate,
    ).toBe('invalidDate')
    expect(validateReminderInput({ title: 'x', dueDate: '' }).isValid).toBe(true)
  })
})
