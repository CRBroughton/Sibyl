import type { Database } from 'libsql'
import type {
  DeleteArgs,
  MappedTable,
  ReplaceValues,
  SelectArgs,
  SibylResponse,
  Sort,
  UpdateArgs,
} from '../types'
import {
  buildSelectQuery,
  buildUpdateQuery,
  convertCreateTableStatement,
  formatInsertStatementLibSQL,
  objectToWhereClause,
} from '../sibylLib'

export default async function Sibyl<T extends Record<string, any>>(db: Database) {
type TableKeys = keyof T
type AccessTable = T[TableKeys]
function createTable<T extends TableKeys>(table: T, tableRow: MappedTable<AccessTable>) {
  const statement = convertCreateTableStatement(tableRow)
  db.exec(`CREATE TABLE ${String(table)} (${statement});`)
}

function Insert<K extends TableKeys>(table: K, rows: AccessTable[]) {
  const statement = formatInsertStatementLibSQL(String(table), rows)
  db.exec(statement)
}

function LimitedSelect<T extends TableKeys, U = AccessTable>(table: T, args: SelectArgs<SibylResponse<U>>) {
  const query = buildSelectQuery(String(table), { ...args, limited: true })
  const record = db.prepare(query).all() as SibylResponse<ReplaceValues<U, AccessTable>>[]

  if (record !== undefined)
    return record

  return undefined
}

function Select<T extends TableKeys>(table: T, args: SelectArgs<SibylResponse<AccessTable>>) {
  const query = buildSelectQuery(String(table), args)
  const record = db.prepare(query).all() as SibylResponse<AccessTable>[]

  if (record !== undefined)
    return record

  return undefined
}

function Create<T extends TableKeys>(table: T, entry: AccessTable) {
  const statement = formatInsertStatementLibSQL(String(table), [entry])
  db.exec(statement)

  const result = Select(table, {
    where: entry,
  })

  if (result !== undefined)
    return result[0]

  return undefined
}

function All<K extends TableKeys>(table: K, args?: { sort: Sort<Partial<AccessTable>> }) {
  let query = `SELECT * from ${String(table)}`

  if (args !== undefined && args.sort) {
    const orders: string[] = []
    query += ' ORDER BY '
    for (const [key, value] of Object.entries(args.sort))
      orders.push(`${key} ${value}`)
    query += orders.join(', ')
  }

  const record = db.prepare(query).all() as SibylResponse<AccessTable>[]

  if (record !== undefined)
    return record

  return undefined
}

function Update<K extends TableKeys>(table: K, args: UpdateArgs<AccessTable>) {
  const query = buildUpdateQuery(table, args)
  db.exec(query)

  const result = Select(table, {
    where: args.where,
  })

  if (result !== undefined)
    return result[0]

  return undefined
}

function Delete<K extends TableKeys>(table: K, args: DeleteArgs<AccessTable>) {
  db.exec(`DELETE FROM ${String(table)} WHERE ${objectToWhereClause(args.where)}`)
}

return {
  createTable,
  LimitedSelect,
  Select,
  All,
  Insert,
  Create,
  Update,
  Delete,
}
}
