import { describe, expect, it } from 'vitest'
import {
  applyReminderChanges,
  buildReminder,
  changeReminderStatus,
  isValidReminder,
  normalizeReminderInput,
  reminderToFormValues,
  sortCompletedReminders,
  sortPendingReminders,
} from './reminder'

const NOW = new Date('2026-10-05T10:00:00.000Z')
const LATER = new Date('2026-10-06T10:00:00.000Z')

describe('normalizeReminderInput', () => {
  it('recorta textos y convierte fecha vacía en null', () => {
    expect(
      normalizeReminderInput({ title: '  Hola ', description: ' x ', dueDate: '' }),
    ).toEqual({ title: 'Hola', description: 'x', dueDate: null })
  })
})

describe('buildReminder', () => {
  it('crea un recordatorio pendiente con ids y fechas', () => {
    const reminder = buildReminder({ title: ' Pagar luz ', dueDate: '2026-09-15' }, NOW)
    expect(reminder).toMatchObject({
      title: 'Pagar luz',
      description: '',
      dueDate: '2026-09-15',
      status: 'pending',
      createdAt: NOW.toISOString(),
      updatedAt: NOW.toISOString(),
      completedAt: null,
    })
    expect(typeof reminder.id).toBe('string')
    expect(isValidReminder(reminder)).toBe(true)
  })
})

describe('applyReminderChanges', () => {
  it('modifica solo los campos editables y actualiza updatedAt', () => {
    const original = buildReminder({ title: 'A', dueDate: '2026-09-15' }, NOW)
    const updated = applyReminderChanges(
      original,
      { title: ' B ', id: 'otro', status: 'completed' },
      LATER,
    )
    expect(updated.title).toBe('B')
    expect(updated.dueDate).toBe('2026-09-15')
    expect(updated.id).toBe(original.id)
    expect(updated.status).toBe('pending')
    expect(updated.createdAt).toBe(original.createdAt)
    expect(updated.updatedAt).toBe(LATER.toISOString())
  })

  it('permite quitar la fecha estimada', () => {
    const original = buildReminder({ title: 'A', dueDate: '2026-09-15' }, NOW)
    expect(applyReminderChanges(original, { dueDate: '' }, LATER).dueDate).toBeNull()
  })
})

describe('changeReminderStatus', () => {
  it('completar fija completedAt y volver a pendiente lo limpia', () => {
    const pending = buildReminder({ title: 'A' }, NOW)
    const completed = changeReminderStatus(pending, 'completed', LATER)
    expect(completed.status).toBe('completed')
    expect(completed.completedAt).toBe(LATER.toISOString())
    expect(isValidReminder(completed)).toBe(true)

    const reopened = changeReminderStatus(completed, 'pending', LATER)
    expect(reopened.status).toBe('pending')
    expect(reopened.completedAt).toBeNull()
  })

  it('es idempotente y ignora estados desconocidos', () => {
    const pending = buildReminder({ title: 'A' }, NOW)
    expect(changeReminderStatus(pending, 'pending', LATER)).toBe(pending)
    expect(changeReminderStatus(pending, 'otro', LATER)).toBe(pending)
  })
})

describe('isValidReminder', () => {
  const valid = buildReminder({ title: 'A' }, NOW)

  it('rechaza valores que no son objetos o con forma incorrecta', () => {
    expect(isValidReminder(null)).toBe(false)
    expect(isValidReminder('x')).toBe(false)
    expect(isValidReminder({ ...valid, id: '' })).toBe(false)
    expect(isValidReminder({ ...valid, title: '  ' })).toBe(false)
    expect(isValidReminder({ ...valid, status: 'otro' })).toBe(false)
    expect(isValidReminder({ ...valid, createdAt: 'nope' })).toBe(false)
    expect(isValidReminder({ ...valid, dueDate: '2026-02-30' })).toBe(false)
  })

  it('exige coherencia entre status y completedAt', () => {
    expect(isValidReminder({ ...valid, completedAt: NOW.toISOString() })).toBe(false)
    expect(isValidReminder({ ...valid, status: 'completed' })).toBe(false)
  })
})

describe('ordenamiento', () => {
  const make = (id, dueDate, createdAt, completedAt = null) => ({
    id,
    dueDate,
    createdAt,
    completedAt,
  })

  it('pendientes: fecha más próxima primero, sin fecha al final y más nuevos primero', () => {
    const list = [
      make('sin-vieja', null, '2026-01-01T00:00:00.000Z'),
      make('sin-nueva', null, '2026-02-01T00:00:00.000Z'),
      make('tarde', '2026-12-01', '2026-01-01T00:00:00.000Z'),
      make('pronto', '2026-10-01', '2026-01-01T00:00:00.000Z'),
      make('pronto-nuevo', '2026-10-01', '2026-03-01T00:00:00.000Z'),
    ]
    expect(sortPendingReminders(list).map((r) => r.id)).toEqual([
      'pronto-nuevo',
      'pronto',
      'tarde',
      'sin-nueva',
      'sin-vieja',
    ])
  })

  it('completados: el más reciente primero, sin mutar el original', () => {
    const list = [
      make('a', null, 'x', '2026-01-01T00:00:00.000Z'),
      make('b', null, 'x', '2026-03-01T00:00:00.000Z'),
    ]
    expect(sortCompletedReminders(list).map((r) => r.id)).toEqual(['b', 'a'])
    expect(list.map((r) => r.id)).toEqual(['a', 'b'])
  })
})

describe('reminderToFormValues', () => {
  it('convierte dueDate null en texto vacío para el formulario', () => {
    const reminder = buildReminder({ title: 'A', description: 'd' }, NOW)
    expect(reminderToFormValues(reminder)).toEqual({
      title: 'A',
      description: 'd',
      dueDate: '',
    })
  })

  it('conserva la fecha cuando existe', () => {
    const reminder = buildReminder({ title: 'A', dueDate: '2026-09-15' }, NOW)
    expect(reminderToFormValues(reminder).dueDate).toBe('2026-09-15')
  })
})
