import { describe, expect, it } from 'vitest'
import { buildReminderIcs, getIcsFileName } from './reminderIcs'

const NOW = new Date('2026-10-05T10:00:00.000Z')
const reminder = (overrides = {}) => ({
  id: 'abc-123',
  title: 'Revisar formularios',
  description: 'Controlar los de 2025',
  dueDate: '2026-09-15',
  ...overrides,
})

// Deshace el plegado de líneas para comparar el contenido original.
const unfold = (ics) => ics.replace(/\r\n /g, '')
const byteLength = (text) => new TextEncoder().encode(text).length

describe('buildReminderIcs', () => {
  it('genera un evento de día completo con los datos del recordatorio', () => {
    const lines = buildReminderIcs(reminder(), NOW).split('\r\n')
    expect(lines).toEqual([
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Remembrall//Reminders//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:abc-123@remembrall',
      'DTSTAMP:20261005T100000Z',
      'DTSTART;VALUE=DATE:20260915',
      'DTEND;VALUE=DATE:20260916',
      'SUMMARY:Revisar formularios',
      'DESCRIPTION:Controlar los de 2025',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ])
  })

  it('el día de fin cruza correctamente fin de mes, de año y años bisiestos', () => {
    expect(buildReminderIcs(reminder({ dueDate: '2026-12-31' }), NOW)).toContain(
      'DTEND;VALUE=DATE:20270101',
    )
    expect(buildReminderIcs(reminder({ dueDate: '2028-02-29' }), NOW)).toContain(
      'DTEND;VALUE=DATE:20280301',
    )
    expect(buildReminderIcs(reminder({ dueDate: '2027-02-28' }), NOW)).toContain(
      'DTEND;VALUE=DATE:20270301',
    )
  })

  it('no incluye DESCRIPTION si no hay descripción', () => {
    expect(buildReminderIcs(reminder({ description: '' }), NOW)).not.toContain(
      'DESCRIPTION',
    )
  })

  it('escapa caracteres especiales y saltos de línea', () => {
    const ics = buildReminderIcs(
      reminder({ title: 'A, B; C\\D', description: 'línea 1\nlínea 2' }),
      NOW,
    )
    expect(ics).toContain('SUMMARY:A\\, B\\; C\\\\D')
    expect(ics).toContain('DESCRIPTION:línea 1\\nlínea 2')
  })

  it('parte las líneas largas en máximo 75 bytes sin alterar el contenido', () => {
    const title = 'palabra '.repeat(40).trim()
    const ics = buildReminderIcs(reminder({ title }), NOW)
    ics.split('\r\n').forEach((line) => {
      expect(byteLength(line)).toBeLessThanOrEqual(75)
    })
    expect(unfold(ics)).toContain(`SUMMARY:${title}`)
  })

  it('no parte caracteres de varios bytes al plegar', () => {
    const title = 'ñ€😀'.repeat(30)
    const ics = buildReminderIcs(reminder({ title }), NOW)
    ics.split('\r\n').forEach((line) => {
      expect(byteLength(line)).toBeLessThanOrEqual(75)
    })
    expect(unfold(ics)).toContain(`SUMMARY:${title}`)
  })

  it('devuelve null si no hay fecha estimada válida', () => {
    expect(buildReminderIcs(reminder({ dueDate: null }), NOW)).toBeNull()
    expect(buildReminderIcs(reminder({ dueDate: '2026-02-30' }), NOW)).toBeNull()
  })
})

describe('getIcsFileName', () => {
  it('arma el nombre a partir del título, sin tildes ni símbolos', () => {
    expect(getIcsFileName(reminder({ title: 'Revisión de formularios' }))).toBe(
      'revision-de-formularios.ics',
    )
    expect(getIcsFileName(reminder({ title: '  ¡Pagar luz & gas!  ' }))).toBe(
      'pagar-luz-gas.ics',
    )
  })

  it('usa un nombre genérico si el título no tiene letras ni números', () => {
    expect(getIcsFileName(reminder({ title: '???' }))).toBe('reminder.ics')
  })

  it('limita el largo del nombre', () => {
    const name = getIcsFileName(reminder({ title: 'a'.repeat(200) }))
    expect(name).toBe(`${'a'.repeat(50)}.ics`)
  })
})
