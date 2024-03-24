import type { DBEntry, DataStructure, SelectArgs, SibylResponse, UpdateArgs } from './types'

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
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === true || obj[key] === false)
        clauses.push(`${key} = '${Number(obj[key])}'`)
      else
        clauses.push(`${key} = '${obj[key]}'`)
    }
  }
  return clauses.join(' AND ')
}

export function objectToOrClause<T>(data: Partial<T>[]) {
  const orConditions: string[] = []
  for (const item of data) {
    const conditions: string[] = []
    for (const [key, value] of Object.entries(item)) {
      const condition = `${key} = '${value}'`
      conditions.push(condition)
    }
    orConditions.push(`${conditions.join(' OR ')}`)
  }
  const orStatement = orConditions.join(' OR ')
  return orStatement
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
  let query: string = ''

  if (args.where.OR === undefined)
    query = `SELECT * from ${table} WHERE ${objectToWhereClause(args.where)}`

  if (args.where.OR !== undefined)
    query = `SELECT * from ${table} WHERE ${objectToOrClause(args.where.OR)}`

  if (args.offset && !args.limit)
    query += ` LIMIT -1 OFFSET ${args.offset}`

  if (args.offset && args.limit)
    query += ` LIMIT ${args.limit} OFFSET ${args.offset}`

  if (!args.offset && args.limit)
    query += ` LIMIT ${args.limit}`

  return `${query};`
}

export function objectToUpdateSetter<T>(obj: Partial<T>): string {
  const clauses = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === true || obj[key] === false)
        clauses.push(`${key} = '${Number(obj[key])}'`)
      else
        clauses.push(`${key} = '${obj[key]}'`)
    }
  }
  return clauses.join(', ')
}

export function buildUpdateQuery<T, K extends string | number | symbol = 'id'>(table: string | number | symbol, args: UpdateArgs<T, K>) {
  return `UPDATE ${String(table)} SET ${objectToUpdateSetter(args.updates)} WHERE ${objectToWhereClause(args.where)};`
}
export function convertCreateTableStatement<T extends Record<string, any>>(obj: T): string {
  let result = ''
  for (const [columnName, columnType] of Object.entries<DBEntry<any>>(sortKeys([obj])[0])) {
    result += columnName

    if (columnType.type)
      result += ` ${columnType.type}`

    if (columnType.primary)
      result += ' PRIMARY KEY'

    if (columnType.autoincrement)
      result += ' AUTOINCREMENT'

    if (columnType.nullable === false)
      result += ' NOT NULL'

    if (columnType.unique)
      result += ' UNIQUE'

    result += ', '
  }

  result = result.slice(0, -2)
  return result
}
