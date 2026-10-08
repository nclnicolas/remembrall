import { describe, expect, it } from 'vitest'
import { buildRemindersCsv, getCsvFileName } from './reminderCsv'

const OPTIONS = {
  headers: {
    title: 'Título',
    description: 'Descripción',
    dueDate: 'Fecha estimada',
    status: 'Estado',
  },
  statusLabels: { pending: 'Pendiente', completed: 'Completado' },
}

const reminder = (overrides = {}) => ({
  title: 'Revisar formularios',
  description: 'Los de 2025',
  dueDate: '2026-09-15',
  status: 'pending',
  ...overrides,
})

// Quita el BOM final de línea para comparar filas.
const rowsOf = (csv) => csv.replace('﻿', '').split('\r\n').slice(0, -1)

describe('buildRemindersCsv', () => {
  it('empieza con BOM, usa ; y saltos de línea CRLF, y termina con salto de línea', () => {
    const csv = buildRemindersCsv([reminder()], OPTIONS)
    expect(csv.startsWith('﻿')).toBe(true)
    expect(csv.endsWith('\r\n')).toBe(true)
    expect(rowsOf(csv)).toEqual([
      'Título;Descripción;Fecha estimada;Estado',
      'Revisar formularios;Los de 2025;15/09/2026;Pendiente',
    ])
  })

  it('con lista vacía solo incluye los encabezados', () => {
    expect(rowsOf(buildRemindersCsv([], OPTIONS))).toEqual([
      'Título;Descripción;Fecha estimada;Estado',
    ])
  })

  it('deja vacía la fecha ausente y traduce el estado completado', () => {
    const csv = buildRemindersCsv(
      [reminder({ dueDate: null, description: '', status: 'completed' })],
      OPTIONS,
    )
    expect(rowsOf(csv)[1]).toBe('Revisar formularios;;;Completado')
  })

  it('entrecomilla los campos con ; comillas o saltos de línea', () => {
    const csv = buildRemindersCsv(
      [reminder({ title: 'A; B', description: 'dijo "hola"\nchau' })],
      OPTIONS,
    )
    expect(csv).toContain('"A; B";"dijo ""hola""\nchau";')
  })

  it('no entrecomilla las comas, que no son el separador', () => {
    const csv = buildRemindersCsv([reminder({ title: 'uno, dos' })], OPTIONS)
    expect(rowsOf(csv)[1].startsWith('uno, dos;')).toBe(true)
  })

  it('neutraliza los textos que Excel interpretaría como fórmula', () => {
    for (const start of ['=1+1', '+1', '-1', '@suma', '- revisar']) {
      const csv = buildRemindersCsv([reminder({ title: start })], OPTIONS)
      expect(rowsOf(csv)[1].startsWith(`'${start};`)).toBe(true)
    }
  })

  it('neutraliza también la descripción pero no el texto normal', () => {
    const csv = buildRemindersCsv(
      [reminder({ title: 'Normal', description: '=SUMA(A1)' })],
      OPTIONS,
    )
    expect(rowsOf(csv)[1]).toBe("Normal;'=SUMA(A1);15/09/2026;Pendiente")
  })
})

describe('getCsvFileName', () => {
  it('arma el nombre con la fecha local', () => {
    expect(
      getCsvFileName(new Date(2026, 9, 4), 'remembrall-recordatorios'),
    ).toBe('remembrall-recordatorios-2026-10-04.csv')
  })
})
