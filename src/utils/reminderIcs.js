import { isValidDateOnly } from './date'

const LINE_BREAK = '\r\n'
const MAX_LINE_BYTES = 75
const encoder = new TextEncoder()

// Texto de una propiedad iCalendar: se escapan \ ; , y los saltos de línea.
function escapeText(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n')
}

// Las líneas no pueden superar 75 bytes: se parten y las continuaciones empiezan con un espacio.
// Se corta por carácter completo para no partir un carácter UTF-8 de varios bytes.
function foldLine(line) {
  if (encoder.encode(line).length <= MAX_LINE_BYTES) return line

  const parts = []
  let current = ''
  let currentBytes = 0
  let limit = MAX_LINE_BYTES

  for (const char of line) {
    const size = encoder.encode(char).length
    if (currentBytes + size > limit) {
      parts.push(current)
      current = ''
      currentBytes = 0
      limit = MAX_LINE_BYTES - 1
    }
    current += char
    currentBytes += size
  }
  parts.push(current)

  return parts.join(`${LINE_BREAK} `)
}

// "2026-09-15" -> "20260915"
function toIcsDate(dateOnly) {
  return dateOnly.replaceAll('-', '')
}

// Día siguiente en formato iCalendar. Se calcula en UTC para evitar corrimientos de zona horaria.
function getNextIcsDate(dateOnly) {
  const [year, month, day] = dateOnly.split('-').map(Number)
  const next = new Date(Date.UTC(year, month - 1, day + 1))
  return toIcsDate(next.toISOString().slice(0, 10))
}

// "2026-10-05T10:00:00.000Z" -> "20261005T100000Z"
function toIcsTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

// Evento de día completo con título, descripción y fecha estimada.
// Devuelve null si el recordatorio no tiene una fecha estimada válida.
// El UID fijo hace que volver a importarlo actualice el evento en vez de duplicarlo.
export function buildReminderIcs(reminder, now = new Date()) {
  if (!isValidDateOnly(reminder.dueDate)) return null

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Remembrall//Reminders//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${reminder.id}@remembrall`,
    `DTSTAMP:${toIcsTimestamp(now)}`,
    `DTSTART;VALUE=DATE:${toIcsDate(reminder.dueDate)}`,
    `DTEND;VALUE=DATE:${getNextIcsDate(reminder.dueDate)}`,
    `SUMMARY:${escapeText(reminder.title)}`,
  ]
  if (reminder.description) {
    lines.push(`DESCRIPTION:${escapeText(reminder.description)}`)
  }
  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.map(foldLine).join(LINE_BREAK) + LINE_BREAK
}

// Nombre de archivo a partir del título: "Revisión de formularios" -> "revision-de-formularios.ics".
export function getIcsFileName(reminder) {
  const slug = reminder.title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .replace(/-+$/, '')

  return `${slug || 'reminder'}.ics`
}
