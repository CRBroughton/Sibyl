import type { Database, SQLQueryBindings } from 'bun:sqlite'
import type {
  MappedTable,
  SelectArgs,
  SibylResponse,
  Sort,
} from '../types'
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

function Insert<K extends TableKeys>(table: K, rows: AccessTable<K>[]) {
  const statement = formatInsertStatement(String(table), rows)
  db.run(statement)
}
function Select<T extends TableKeys>(table: T, args: SelectArgs<AccessTable<T>>) {
  const query = buildSelectQuery(String(table), args)
  const record = db.query<SibylResponse<AccessTable<T>>, SQLQueryBindings[]>(query)

  if (record !== undefined)
    return record.all()[0]

  return undefined
}
function Create<T extends TableKeys>(table: T, entry: AccessTable<T>) {
  const statement = formatInsertStatement(String(table), [entry])
  db.run(statement)
  const result = Select(table, {
    where: entry,
  })

  if (result !== undefined)
    return result

  return undefined
}

function All<K extends TableKeys>(table: K, args?: { sort: Sort<Partial<AccessTable<K>>> }) {
  let query = `SELECT * from ${String(table)}`

  if (args !== undefined && args.sort) {
    const orders: string[] = []
    query += ' ORDER BY '
    for (const [key, value] of Object.entries(args.sort))
      orders.push(`${key} ${value}`)
    query += orders.join(', ')
  }

  const record = db.query(query)

  if (record !== undefined)
    return record.all()

  return undefined
}

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
