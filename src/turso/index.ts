import type { Client } from '@libsql/core/api'
import type {
  DeleteArgs,
  MappedTable,
  SelectArgs,
  SibylResponse,
  Sort,
  UpdateArgs,
} from '../types'
import {
  buildSelectQuery,
  buildUpdateQuery,
  convertCreateTableStatement,
  formatInsertStatement,
  objectToWhereClause,
} from '../sibylLib'

export default async function Sibyl<T extends Record<string, any>>(client: Client) {
type TableKeys = keyof T
type AccessTable<I extends keyof T> = T[I]
function createTable<T extends TableKeys>(table: T, tableRow: MappedTable<AccessTable<T>>) {
  const statement = convertCreateTableStatement(tableRow)
  client.execute(`CREATE TABLE ${String(table)} (${statement})`)
}

function Insert<K extends TableKeys>(table: K, rows: AccessTable<K>[]) {
  const statement = formatInsertStatement(String(table), rows)
  client.execute(statement)
}
async function Select<T extends TableKeys>(table: T, args: SelectArgs<SibylResponse<AccessTable<T>>>) {
  const query = buildSelectQuery(String(table), args)
  const record = await client.execute(query)

  if (record !== undefined)
    return record.toJSON()

  return undefined
}
async function Create<T extends TableKeys>(table: T, entry: AccessTable<T>) {
  const statement = formatInsertStatement(String(table), [entry])
  client.execute(statement)
  const result = await Select(table, {
    where: entry,
  })

  if (result !== undefined)
    return result

  return undefined
}

async function All<K extends TableKeys>(table: K, args?: { sort: Sort<Partial<AccessTable<K>>> }) {
  let query = `SELECT * from ${String(table)}`

  if (args !== undefined && args.sort) {
    const orders: string[] = []
    query += ' ORDER BY '
    for (const [key, value] of Object.entries(args.sort))
      orders.push(`${key} ${value}`)
    query += orders.join(', ')
  }

  const record = await client.execute(query)

  if (record !== undefined)
    return record.toJSON()

  return undefined
}

async function Update<K extends TableKeys>(table: K, args: UpdateArgs<AccessTable<K>>) {
  const query = buildUpdateQuery(table, args)
  client.execute(query)

  const result = await Select(table, {
    where: args.where,
  })

  if (result !== undefined)
    return result

  return undefined
}
async function Delete<K extends TableKeys>(table: K, args: DeleteArgs<AccessTable<K>>) {
  client.execute(`DELETE FROM ${String(table)} WHERE ${objectToWhereClause(args.where)}`)
}

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
