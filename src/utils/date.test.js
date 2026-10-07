import { describe, expect, it } from 'vitest'
import { formatDateOnly, isValidDateOnly, isValidTimestamp } from './date'

describe('isValidDateOnly', () => {
  it('acepta fechas reales en formato YYYY-MM-DD', () => {
    expect(isValidDateOnly('2026-09-15')).toBe(true)
    expect(isValidDateOnly('2028-02-29')).toBe(true)
  })

  it('rechaza fechas inexistentes, formatos distintos y valores que no son texto', () => {
    expect(isValidDateOnly('2026-02-30')).toBe(false)
    expect(isValidDateOnly('2027-02-29')).toBe(false)
    expect(isValidDateOnly('2026-13-01')).toBe(false)
    expect(isValidDateOnly('15/09/2026')).toBe(false)
    expect(isValidDateOnly('')).toBe(false)
    expect(isValidDateOnly(null)).toBe(false)
    expect(isValidDateOnly(20260915)).toBe(false)
  })
})

describe('formatDateOnly', () => {
  it('formatea como dd/mm/yyyy', () => {
    expect(formatDateOnly('2026-09-05')).toBe('05/09/2026')
  })

  it('devuelve texto vacío si la fecha no es válida', () => {
    expect(formatDateOnly('2026-02-30')).toBe('')
    expect(formatDateOnly(undefined)).toBe('')
  })
})

describe('isValidTimestamp', () => {
  it('valida strings ISO', () => {
    expect(isValidTimestamp('2026-10-05T12:00:00.000Z')).toBe(true)
    expect(isValidTimestamp('no es fecha')).toBe(false)
    expect(isValidTimestamp(null)).toBe(false)
  })
})
