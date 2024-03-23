import type { Database } from 'sql.js'
import { buildSelectQuery, buildUpdateQuery, convertBooleanValues, convertCreateTableStatement, convertToObjects, formatInsertStatement, objectToWhereClause } from './sibylLib'
import type { DeleteArgs, SelectArgs, UpdateArgs } from './types'

export default async function Sibyl<T extends Record<string, any>>(db: Database) {
type DBBoolean = 'bool'
type DBNumber = 'int' | 'real'
type DBString = 'varchar' | 'char'
type DBDate = 'text' | 'int' | 'real'
type DBBlob = 'blob'

interface DBEntry<T> {
  type: T
  nullable: boolean
  unique: boolean
  autoincrement: boolean
}

type DBValue<T> = T extends DBNumber
  ? DBEntry<T>
  : Omit<DBEntry<T>, 'autoincrement'> & { type: T }

type MappedTable<T> = {
  [Key in keyof T]:
  T[Key] extends boolean ? DBValue<DBBoolean> :
    T[Key] extends number ? DBValue<DBNumber> :
      T[Key] extends string ? DBValue<DBString> :
        T[Key] extends Date ? DBValue<DBDate> :
          T[Key] extends Blob ? DBValue<DBBlob> :
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

function Select<T extends TableKeys>(table: T, args: SelectArgs<AccessTable<T>>) {
  const query = buildSelectQuery(String(table), args)
  const record = db.exec(query)

  if (record[0]) {
    return convertBooleanValues(convertToObjects<AccessTable<T>>({
      columns: record[0].columns,
      values: record[0].values,
    }))
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
    return convertBooleanValues(convertToObjects<AccessTable<K>>({
      columns: record[0].columns,
      values: record[0].values,
    }))
  }

  return undefined
}

function Update<K extends TableKeys>(table: K, args: UpdateArgs<AccessTable<K>>) {
  const query = buildUpdateQuery(table, args)
  db.exec(query)

  const result = Select(table, {
    where: args.where,
  })

  if (result !== undefined)
    return result[0]

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
  Update,
  Delete,
}
}
