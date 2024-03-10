import type { Database } from 'sql.js'

interface SelectArgs<T> {
  where: Partial<T>
  offset?: number
  limit?: number
}

interface DataStructure {
  columns: string[]
  values: any[][]
}

export async function Sibyl<T extends Record<string, any>>(db: Database, table: string) {
  function createTable(columns: string) {
    db.run(`CREATE TABLE ${table} (${columns});`)
  }

  function sortKeys<T extends { [key: string]: any }>(arr: T[]): T[] {
    return arr.map(obj => {
      const sortedKeys = Object.keys(obj).sort()
      const sortedObj: { [key: string]: any } = {}
      sortedKeys.forEach(key => {
        sortedObj[key] = obj[key]
      })
      return sortedObj as T
    })
  }

  function formatInsertStatement(table: string, structs: T[]) {
    const sortedStructs = sortKeys(structs)
    const flattenedInsert = sortedStructs.map(obj => Object.values(obj))
    let insertions: string = ''
    for (const insert of flattenedInsert) {
      let row: T | string[] = []
      for (const cell of insert) {
        if (typeof cell !== 'string')
          row = [...row, cell]

        if (typeof cell === 'string')
          row = [...row, `"${cell}"`]
      }
      insertions += `INSERT INTO ${table} VALUES (${row}); `
    }
    insertions.slice(0, -1)
    return insertions.trim()
  }

  function Insert(table: string, rows: T[]) {
    const statement = formatInsertStatement(table, rows)
    db.run(statement)
  }

  function objectToWhereClause(obj: Partial<T>): string {
    const clauses = []
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key))
        clauses.push(`${key} = '${obj[key]}'`)
    }
    return clauses.join(' AND ')
  }

  function buildSelectQuery(args: SelectArgs<T>) {
    let query = `SELECT * from ${table} WHERE ${objectToWhereClause(args.where)}`

    if (args.offset && !args.limit)
      query += ` LIMIT -1 OFFSET ${args.offset}`

    if (args.offset && args.limit)
      query += ` LIMIT ${args.limit} OFFSET ${args.offset}`

    if (!args.offset && args.limit)
      query += ` LIMIT ${args.limit}`

    return `${query};`
  }

  function convertToObjects(data: DataStructure): T[] {
    const result: T[] = []
    for (const valueArray of data.values) {
      const obj: any = {}
      for (let i = 0; i < data.columns.length; i++)
        obj[data.columns[i]] = valueArray[i]

      result.push(obj)
    }
    return result
  }

  function Select(args: SelectArgs<T>) {
    const query = buildSelectQuery(args)
    const record = db.exec(query)

    if (record[0]) {
      return convertToObjects({
        columns: record[0].columns,
        values: record[0].values,
      })
    }

    return undefined
  }

  function Create(table: string, entry: T) {
    const statement = formatInsertStatement(table, [entry])
    db.run(statement)
    return Select({
      where: entry
    })
  }

  function All() {
    const record = db.exec(`SELECT * from ${table}`)

    if (record[0]) {
      return convertToObjects({
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
    objectToWhereClause,
    buildSelectQuery,
    convertToObjects,
    sortKeys,
    Create,
  }
}
