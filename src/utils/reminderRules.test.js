import { describe, expect, it } from 'vitest'
import {
  getExpirationTimestamp,
  getPendingDays,
  isExpiredCompleted,
  needsAttention,
} from './reminderRules'

const DAY = 24 * 60 * 60 * 1000
const NOW = new Date('2026-10-20T12:00:00.000Z')
const ago = (ms) => new Date(NOW.getTime() - ms).toISOString()

const pending = (createdAt) => ({ status: 'pending', createdAt, completedAt: null })
const completed = (completedAt) => ({
  status: 'completed',
  createdAt: '2026-01-01T00:00:00.000Z',
  completedAt,
})

describe('needsAttention', () => {
  it('no avisa antes de las 72 horas y avisa justo en las 72 horas', () => {
    expect(needsAttention(pending(ago(3 * DAY - 1)), NOW)).toBe(false)
    expect(needsAttention(pending(ago(3 * DAY)), NOW)).toBe(true)
    expect(needsAttention(pending(ago(10 * DAY)), NOW)).toBe(true)
  })

  it('nunca aplica a completados', () => {
    const old = { ...completed(ago(DAY)), createdAt: ago(10 * DAY) }
    expect(needsAttention(old, NOW)).toBe(false)
  })

  it('ignora fechas inválidas o en el futuro', () => {
    expect(needsAttention(pending('no es fecha'), NOW)).toBe(false)
    expect(needsAttention(pending(null), NOW)).toBe(false)
    expect(needsAttention(pending(new Date(NOW.getTime() + DAY).toISOString()), NOW)).toBe(false)
  })
})

describe('getPendingDays', () => {
  it('cuenta días completos', () => {
    expect(getPendingDays(pending(ago(3 * DAY)), NOW)).toBe(3)
    expect(getPendingDays(pending(ago(5 * DAY + DAY / 2)), NOW)).toBe(5)
  })

  it('devuelve 0 con fechas inválidas o futuras', () => {
    expect(getPendingDays(pending('x'), NOW)).toBe(0)
    expect(getPendingDays(pending(new Date(NOW.getTime() + DAY).toISOString()), NOW)).toBe(0)
  })
})

describe('isExpiredCompleted', () => {
  it('vence recién a los 30 días exactos', () => {
    expect(isExpiredCompleted(completed(ago(30 * DAY - 1)), NOW)).toBe(false)
    expect(isExpiredCompleted(completed(ago(30 * DAY)), NOW)).toBe(true)
    expect(isExpiredCompleted(completed(ago(45 * DAY)), NOW)).toBe(true)
  })

  it('nunca aplica a pendientes', () => {
    expect(isExpiredCompleted(pending(ago(90 * DAY)), NOW)).toBe(false)
  })

  it('ignora fechas inválidas o en el futuro', () => {
    expect(isExpiredCompleted(completed('x'), NOW)).toBe(false)
    expect(isExpiredCompleted(completed(null), NOW)).toBe(false)
    expect(isExpiredCompleted(completed(new Date(NOW.getTime() + DAY).toISOString()), NOW)).toBe(false)
  })
})

describe('getExpirationTimestamp', () => {
  it('suma 30 días al completado', () => {
    expect(getExpirationTimestamp(completed('2026-10-01T10:00:00.000Z'))).toBe(
      '2026-10-31T10:00:00.000Z',
    )
  })

  it('devuelve null para pendientes o fechas inválidas', () => {
    expect(getExpirationTimestamp(pending(ago(DAY)))).toBeNull()
    expect(getExpirationTimestamp(completed('x'))).toBeNull()
  })
})
