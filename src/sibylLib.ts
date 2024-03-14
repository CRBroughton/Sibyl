import type { DataStructure, SelectArgs, SibylResponse } from './types'

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
  return arr.map((obj) => {
    const sortedKeys = Object.keys(obj).sort()
    const sortedObj: { [key: string]: any } = {}
    sortedKeys.forEach((key) => {
      sortedObj[key] = obj[key]
    })
    return sortedObj as T
  })
}

export function objectToWhereClause<T>(obj: Partial<T>): string {
  const clauses = []
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === true || obj[key] === false)
        clauses.push(`${key} = '${Number(obj[key])}'`)
      else
        clauses.push(`${key} = '${obj[key]}'`)
    }
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

export function convertBooleanValues<T>(arr: T[]) {
  return arr.map((obj) => {
    const convertedObj = {} as SibylResponse<T>
    for (const key in obj) {
      if (typeof obj[key] === 'boolean')
        convertedObj[key as keyof T] = obj[key] ? 1 : 0 as any
      else
        convertedObj[key as keyof T] = obj[key] as SibylResponse<T>[keyof T]
    }
    return convertedObj
  })
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

export function convertCreateTableStatement<T extends Record<string, any>>(obj: T): string {
  let result = ''
  for (const [columnName, columnType] of Object.entries(sortKeys([obj])[0]))
    result += `${columnName} ${columnType}, `

  result = result.slice(0, -2)
  return result
}
