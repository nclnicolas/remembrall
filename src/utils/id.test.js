import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateId } from './id'

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('generateId', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('genera un UUID v4 válido y distinto en cada llamada', () => {
    const a = generateId()
    const b = generateId()
    expect(a).toMatch(UUID_V4)
    expect(a).not.toBe(b)
  })

  it('genera un UUID v4 válido cuando randomUUID no está disponible', () => {
    const realCrypto = globalThis.crypto
    vi.stubGlobal('crypto', {
      getRandomValues: (array) => realCrypto.getRandomValues(array),
    })
    expect(generateId()).toMatch(UUID_V4)
  })
})
