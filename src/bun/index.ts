import type { Database, SQLQueryBindings } from 'bun:sqlite'
import type { MappedTable, SelectArgs } from '../types'
import {
  buildSelectQuery,
  convertCreateTableStatement,
  formatInsertStatement,
} from '../sqljs/sibylLib'

export default async function bSibyl<T extends Record<string, any>>(db: Database) {
type TableKeys = keyof T
type AccessTable<I extends keyof T> = T[I]
function createTable<T extends TableKeys>(table: T, tableRow: MappedTable<AccessTable<T>>) {
  const statement = convertCreateTableStatement(tableRow)
  db.query(`CREATE TABLE ${String(table)} (${statement})`).run()
}
function Insert() { }
function Select<T extends TableKeys>(table: T, args: SelectArgs<AccessTable<T>>) {
  const query = buildSelectQuery(String(table), args)
  const record = db.query<AccessTable<T>, SQLQueryBindings[]>(query)

  if (record !== undefined)
    return record

  return undefined
}
function Create<T extends TableKeys>(table: T, entry: AccessTable<T>) {
  const statement = formatInsertStatement(String(table), [entry])
  db.run(statement)
  const result = Select(table, {
    where: entry,
  })

  if (result !== undefined)
    return result.all()[0]

  return undefined
}
function All() { }
function Update() { }
function Delete() { }

return {
  createTable,
  Insert,
  Select,
  Create,
  All,
  Update,
  Delete,
}
}
