import type { Database } from 'sql.js'
import type { DeleteArgs, MappedTable, SelectArgs, SibylResponse, Sort, UpdateArgs } from '../types'
import {
  buildSelectQuery,
  buildUpdateQuery,
  convertBooleanValues,
  convertCreateTableStatement,
  convertToObjects,
  formatInsertStatement,
  objectToWhereClause,
} from '../sibylLib'

export default async function Sibyl<T extends Record<string, any>>(db: Database) {
type TableKeys = keyof T
type AccessTable = T[TableKeys]
function createTable<T extends TableKeys>(table: T, tableRow: MappedTable<AccessTable<T>>) {
  const statement = convertCreateTableStatement(tableRow)
  db.run(`CREATE TABLE ${String(table)} (${statement});`)
}

function Insert<K extends TableKeys>(table: K, rows: AccessTable[]) {
  const statement = formatInsertStatement(String(table), rows)
  db.run(statement)
}

function Select<T extends TableKeys>(table: T, args: SelectArgs<SibylResponse<AccessTable>>) {
  const query = buildSelectQuery(String(table), args)
  const record = db.exec(query)

  if (record[0]) {
    return convertBooleanValues(convertToObjects<AccessTable>({
      columns: record[0].columns,
      values: record[0].values,
    }))
  }

  return undefined
}

function Create<T extends TableKeys>(table: T, entry: AccessTable) {
  const statement = formatInsertStatement(String(table), [entry])
  db.run(statement)
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

  const record = db.exec(query)

  if (record[0]) {
    return convertBooleanValues(convertToObjects<AccessTable>({
      columns: record[0].columns,
      values: record[0].values,
    }))
  }

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
  db.run(`DELETE FROM ${String(table)} WHERE ${objectToWhereClause(args.where)}`)
}

return {
  createTable,
  Select,
  All,
  Insert,
  Create,
  Update,
  Delete,
}
}
