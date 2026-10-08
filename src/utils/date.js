const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

// Fecha sin hora con formato YYYY-MM-DD (el valor de <input type="date">).
export function isValidDateOnly(value) {
  if (typeof value !== 'string') return false

  const match = DATE_ONLY_PATTERN.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

// "2026-09-15" -> "15/09/2026". Se arma desde el texto para evitar corrimientos de zona horaria.
export function formatDateOnly(value) {
  if (!isValidDateOnly(value)) return ''

  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function isValidTimestamp(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

// "2026-09-08T15:00:00.000Z" -> "08/09/2026" en la fecha local del usuario.
export function formatTimestamp(value) {
  if (!isValidTimestamp(value)) return ''

  const date = new Date(value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}
