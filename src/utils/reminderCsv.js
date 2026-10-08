import { formatDateOnly } from './date'

// ; porque Excel configurado en español lo espera como separador de columnas.
const DELIMITER = ';'
const LINE_BREAK = '\r\n'
// El BOM hace que Excel interprete el archivo como UTF-8 (tildes y ñ).
const BOM = '﻿'
// Excel ejecuta como fórmula una celda que empieza con estos caracteres.
const FORMULA_START = /^[=+\-@\t\r]/

// Texto escrito por el usuario: se antepone ' para que no se interprete como fórmula.
function neutralizeFormula(value) {
  return FORMULA_START.test(value) ? `'${value}` : value
}

// Se entrecomilla solo si hace falta, duplicando las comillas internas.
function escapeField(value) {
  return /["\r\n;]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}

function buildRow(fields) {
  return fields.map(escapeField).join(DELIMITER)
}

// headers: { title, description, dueDate, status }; statusLabels: { pending, completed }.
// Las fechas salen como en la app (dd/mm/yyyy).
export function buildRemindersCsv(reminders, { headers, statusLabels }) {
  const rows = [
    buildRow([headers.title, headers.description, headers.dueDate, headers.status]),
    ...reminders.map((reminder) =>
      buildRow([
        neutralizeFormula(reminder.title),
        neutralizeFormula(reminder.description),
        reminder.dueDate ? formatDateOnly(reminder.dueDate) : '',
        statusLabels[reminder.status],
      ]),
    ),
  ]

  return BOM + rows.join(LINE_BREAK) + LINE_BREAK
}

// "remembrall-recordatorios" + 2026-10-14 -> "remembrall-recordatorios-2026-10-14.csv" (fecha local).
export function getCsvFileName(date, prefix) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${prefix}-${date.getFullYear()}-${month}-${day}.csv`
}
