import type { Database } from 'sql.js'
import { buildSelectQuery, convertCreateTableStatement, convertToObjects, formatInsertStatement } from './sibylLib'
import type { SelectArgs } from './types'

export default async function Sibyl<T extends Record<string, any>, U extends string[]>(db: Database, tables: U) {
type MappedTable = {
  [Key in keyof T]: 'int' | 'char' | 'blob'
}
function createTable(table: typeof tables[number], tableRow: MappedTable) {
  const statement = convertCreateTableStatement(tableRow)
  db.run(`CREATE TABLE ${table} (${statement});`)
}

function Insert(table: string, rows: T[]) {
  const statement = formatInsertStatement(table, rows)
  db.run(statement)
}

function Select(table: typeof tables[number], args: SelectArgs<T>) {
  const query = buildSelectQuery(table, args)
  const record = db.exec(query)

  if (record[0]) {
    return convertToObjects<T>({
      columns: record[0].columns,
      values: record[0].values,
    })
  }

  return undefined
}

function Create(table: typeof tables[number], entry: T) {
  const statement = formatInsertStatement(table, [entry])
  db.run(statement)
  const result = Select(table, {
    where: entry,
  })

  if (result !== undefined)
    return result[0]

  return undefined
}

function All(table: typeof tables[number]) {
  const record = db.exec(`SELECT * from ${table}`)

  if (record[0]) {
    return convertToObjects<T>({
      columns: record[0].columns,
      values: record[0].values,
    })
  }

  return undefined
}

return {
  createTable,
  formatInsertStatement,
  Select,
  All,
  Insert,
  Create,
}
}
