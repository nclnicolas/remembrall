import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { REMINDERS_STORAGE_KEY } from '../constants/reminder'
import reminderService from './reminderService'

function createFakeStorage() {
  const data = new Map()
  return {
    data,
    failWrites: false,
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem(key, value) {
      if (this.failWrites) throw new Error('quota')
      data.set(key, String(value))
    },
    removeItem: (key) => data.delete(key),
  }
}

let storage

beforeEach(() => {
  storage = createFakeStorage()
  vi.stubGlobal('localStorage', storage)
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-10-05T10:00:00.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('getAll', () => {
  it('devuelve [] si no hay nada guardado', () => {
    expect(reminderService.getAll()).toEqual([])
  })

  it('devuelve [] si el JSON está corrupto o no es un array', () => {
    storage.data.set(REMINDERS_STORAGE_KEY, '{no es json')
    expect(reminderService.getAll()).toEqual([])
    storage.data.set(REMINDERS_STORAGE_KEY, JSON.stringify({ a: 1 }))
    expect(reminderService.getAll()).toEqual([])
  })

  it('descarta entradas inválidas y conserva las válidas', () => {
    const { reminder } = reminderService.create({ title: 'Válido' })
    storage.data.set(
      REMINDERS_STORAGE_KEY,
      JSON.stringify([reminder, { id: 'x' }, null]),
    )
    expect(reminderService.getAll()).toEqual([reminder])
  })
})

describe('create', () => {
  it('guarda un recordatorio válido', () => {
    const result = reminderService.create({
      title: ' Pagar luz ',
      dueDate: '2026-09-15',
    })
    expect(result.ok).toBe(true)
    expect(result.reminder.title).toBe('Pagar luz')
    expect(reminderService.getAll()).toEqual([result.reminder])
    expect(reminderService.getById(result.reminder.id)).toEqual(result.reminder)
  })

  it('devuelve errores de validación sin guardar', () => {
    const result = reminderService.create({ title: '  ' })
    expect(result).toEqual({
      ok: false,
      error: 'validation',
      fieldErrors: { title: 'required' },
    })
    expect(reminderService.getAll()).toEqual([])
  })

  it('informa error de almacenamiento si no se puede escribir', () => {
    storage.failWrites = true
    expect(reminderService.create({ title: 'A' })).toEqual({
      ok: false,
      error: 'storage',
    })
  })
})

describe('update', () => {
  it('modifica los campos y actualiza updatedAt', () => {
    const { reminder } = reminderService.create({ title: 'A' })
    vi.setSystemTime(new Date('2026-10-06T10:00:00.000Z'))

    const result = reminderService.update(reminder.id, { title: 'B' })
    expect(result.ok).toBe(true)
    expect(result.reminder.title).toBe('B')
    expect(result.reminder.updatedAt).toBe('2026-10-06T10:00:00.000Z')
    expect(reminderService.getById(reminder.id).title).toBe('B')
  })

  it('valida los cambios y no guarda si son inválidos', () => {
    const { reminder } = reminderService.create({ title: 'A' })
    const result = reminderService.update(reminder.id, { title: '' })
    expect(result.error).toBe('validation')
    expect(reminderService.getById(reminder.id).title).toBe('A')
  })

  it('devuelve notFound si el id no existe', () => {
    expect(reminderService.update('nope', { title: 'B' })).toEqual({
      ok: false,
      error: 'notFound',
    })
  })
})

describe('setStatus', () => {
  it('completa y reabre un recordatorio', () => {
    const { reminder } = reminderService.create({ title: 'A' })

    const done = reminderService.setStatus(reminder.id, 'completed')
    expect(done.reminder.status).toBe('completed')
    expect(done.reminder.completedAt).toBe('2026-10-05T10:00:00.000Z')

    const reopened = reminderService.setStatus(reminder.id, 'pending')
    expect(reopened.reminder.status).toBe('pending')
    expect(reopened.reminder.completedAt).toBeNull()
  })

  it('es idempotente: repetir el estado no modifica el recordatorio', () => {
    const { reminder } = reminderService.create({ title: 'A' })
    vi.setSystemTime(new Date('2026-10-06T10:00:00.000Z'))
    const result = reminderService.setStatus(reminder.id, 'pending')
    expect(result.reminder.updatedAt).toBe(reminder.updatedAt)
  })

  it('rechaza estados desconocidos e ids inexistentes', () => {
    const { reminder } = reminderService.create({ title: 'A' })
    expect(reminderService.setStatus(reminder.id, 'otro').error).toBe('validation')
    expect(reminderService.setStatus('nope', 'completed').error).toBe('notFound')
  })
})

describe('delete', () => {
  it('elimina el recordatorio indicado', () => {
    const a = reminderService.create({ title: 'A' }).reminder
    const b = reminderService.create({ title: 'B' }).reminder
    expect(reminderService.delete(a.id)).toEqual({ ok: true })
    expect(reminderService.getAll()).toEqual([b])
  })

  it('devuelve notFound si el id no existe', () => {
    expect(reminderService.delete('nope')).toEqual({ ok: false, error: 'notFound' })
  })
})

describe('update sin cambios y sobre completados', () => {
  it('no modifica updatedAt ni escribe si no cambió ningún campo', () => {
    const { reminder } = reminderService.create({
      title: 'A',
      dueDate: '2026-09-15',
    })
    vi.setSystemTime(new Date('2026-10-06T10:00:00.000Z'))
    storage.failWrites = true

    const result = reminderService.update(reminder.id, {
      title: ' A ',
      description: '',
      dueDate: '2026-09-15',
    })
    expect(result).toEqual({ ok: true, reminder })
  })

  it('al editar un completado conserva status y completedAt', () => {
    const { reminder } = reminderService.create({ title: 'A' })
    const completed = reminderService.setStatus(reminder.id, 'completed').reminder
    vi.setSystemTime(new Date('2026-10-06T10:00:00.000Z'))

    const result = reminderService.update(reminder.id, { title: 'B' })
    expect(result.reminder).toMatchObject({
      title: 'B',
      status: 'completed',
      completedAt: completed.completedAt,
      updatedAt: '2026-10-06T10:00:00.000Z',
    })
  })
})

describe('delete con fallo de almacenamiento', () => {
  it('informa error de almacenamiento y no pierde el recordatorio', () => {
    const { reminder } = reminderService.create({ title: 'A' })
    storage.failWrites = true
    expect(reminderService.delete(reminder.id)).toEqual({
      ok: false,
      error: 'storage',
    })
    storage.failWrites = false
    expect(reminderService.getById(reminder.id)).toEqual(reminder)
  })
})
