import type { Database } from 'sql.js'
import { buildSelectQuery, convertToObjects, formatInsertStatement } from './sibylLib'
import type { SelectArgs } from './types'

export default async function Sibyl<T extends Record<string, any>>(db: Database, table: string) {
  function createTable(columns: string) {
    db.run(`CREATE TABLE ${table} (${columns});`)
  }

  function Insert(table: string, rows: T[]) {
    const statement = formatInsertStatement(table, rows)
    db.run(statement)
  }

  function Select(args: SelectArgs<T>) {
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

  function Create(table: string, entry: T) {
    const statement = formatInsertStatement(table, [entry])
    db.run(statement)
    const result = Select({
      where: entry,
    })

    if (result !== undefined)
      return result[0]

    return undefined
  }

  function All() {
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
