import type { Database } from 'sql.js'
import { buildSelectQuery, convertCreateTableStatement, convertToObjects, formatInsertStatement, objectToWhereClause } from './sibylLib'
import type { DeleteArgs, SelectArgs } from './types'

export default async function Sibyl<T extends Record<string, any>>(db: Database) {
type MappedTable<T> = {
  [Key in keyof T]:
  T[Key] extends boolean ? 'bool' :
    T[Key] extends number ? 'int' | 'real' :
      T[Key] extends string ? 'varchar' | 'char' :
        T[Key] extends Date ? 'text' | 'int' | 'real' :
          T[Key] extends Blob ? 'blob' :
            null
}

type TableKeys = keyof T
type AccessTable<I extends keyof T> = T[I]
function createTable<T extends TableKeys>(table: T, tableRow: MappedTable<AccessTable<T>>) {
  const statement = convertCreateTableStatement(tableRow)
  db.run(`CREATE TABLE ${String(table)} (${statement});`)
}

function Insert<K extends TableKeys>(table: K, rows: AccessTable<K>[]) {
  const statement = formatInsertStatement(String(table), rows)
  db.run(statement)
}

function Select<K extends TableKeys>(table: K, args: SelectArgs<AccessTable<K>>) {
  const query = buildSelectQuery(String(table), args)
  const record = db.exec(query)

  if (record[0]) {
    return convertToObjects<AccessTable<K>>({
      columns: record[0].columns,
      values: record[0].values,
    })
  }

  return undefined
}

function Create<T extends TableKeys>(table: T, entry: AccessTable<T>) {
  const statement = formatInsertStatement(String(table), [entry])
  db.run(statement)
  const result = Select(table, {
    where: entry,
  })

  if (result !== undefined)
    return result[0]

  return undefined
}

function All<K extends TableKeys>(table: K) {
  const record = db.exec(`SELECT * from ${String(table)}`)

  if (record[0]) {
    return convertToObjects<AccessTable<K>>({
      columns: record[0].columns,
      values: record[0].values,
    })
  }

  return undefined
}

function Delete<K extends TableKeys>(table: K, args: DeleteArgs<AccessTable<K>>) {
  db.run(`DELETE FROM ${String(table)} WHERE ${objectToWhereClause(args.where)}`)
}

return {
  createTable,
  formatInsertStatement,
  Select,
  All,
  Insert,
  Create,
  Delete,
}
}

interface TableRow {
  id: number
  name: string
  location: string
  booleanTest: boolean
}

type MutableTableRow<T> = {
  [K in keyof T]: K extends keyof TableRow ? (TableRow[K] extends boolean ? 0 | 1 : TableRow[K]) : 0 | 1
}

// Example usage
const mutableRow: MutableTableRow<TableRow> = {
  id: 1,
  location: 'New York',
  name: 'John Doe',
  booleanTest: true,
}

mutableRow.id = 2 // Works
mutableRow.location = 'Los Angeles' // Works
mutableRow.name = 'Jane Doe' // Works
mutableRow.booleanTest = 0 // Works
mutableRow.booleanTest = false // Works
