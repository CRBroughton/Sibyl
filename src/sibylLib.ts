import type { DataStructure, SelectArgs } from "./types"

export function formatInsertStatement<T extends Record<string, any>>(table: string, structs: T[]) {
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

export function sortKeys<T extends { [key: string]: any }>(arr: T[]): T[] {
  return arr.map(obj => {
    const sortedKeys = Object.keys(obj).sort()
    const sortedObj: { [key: string]: any } = {}
    sortedKeys.forEach(key => {
      sortedObj[key] = obj[key]
    })
    return sortedObj as T
  })
}

export function objectToWhereClause<T>(obj: Partial<T>): string {
  const clauses = []
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key))
      clauses.push(`${key} = '${obj[key]}'`)
  }
  return clauses.join(' AND ')
}

export function convertToObjects<T>(data: DataStructure): T[] {
  const result: T[] = []
  for (const valueArray of data.values) {
    const obj: any = {}
    for (let i = 0; i < data.columns.length; i++)
      obj[data.columns[i]] = valueArray[i]

    result.push(obj)
  }
  return result
}

export function buildSelectQuery<T>(table: string, args: SelectArgs<T>) {
  let query = `SELECT * from ${table} WHERE ${objectToWhereClause(args.where)}`

  if (args.offset && !args.limit)
    query += ` LIMIT -1 OFFSET ${args.offset}`

  if (args.offset && args.limit)
    query += ` LIMIT ${args.limit} OFFSET ${args.offset}`

  if (!args.offset && args.limit)
    query += ` LIMIT ${args.limit}`

  return `${query};`
}