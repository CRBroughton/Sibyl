import type {
  DBEntry,
  DBTypes,
  DataStructure,
  SelectArgs,
  SibylResponse,
  UpdateArgs,
} from './types'

export function formatInsertStatement<T extends Record<string, any>>(table: string, structs: T[]) {
  const sortedStructs = sortKeys(structs)
  const flattenedInsert = sortedStructs.map(obj => Object.values(obj))
  let insertions: string = ''
  insertions += `INSERT INTO ${table} VALUES `
  for (const insert of flattenedInsert) {
    let row: T | string[] = []
    for (const cell of insert) {
      if (typeof cell !== 'string')
        row = [...row, cell]

      if (typeof cell === 'string')
        row = [...row, `"${cell}"`]
    }
    insertions += `(${row}), `
  }
  insertions = insertions.slice(0, -2)
  insertions.trim()
  insertions += ';'
  return insertions
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

export function buildSelectQuery<T>(table: string, args: SelectArgs<T> | SelectArgs<T> & { limited: boolean }) {
  let query: string = ''

  if ('limited' in args) {
    if (args.limited === true) {
      let selectedKeys = ''
      for (const [key] of Object.entries(args.where))
        selectedKeys += `${key}, `

      selectedKeys = selectedKeys.slice(0, -2)

      query = `SELECT ${selectedKeys} from ${table} WHERE ${objectToWhereClause(args.where)}`
    }
  }
  else {
    query += 'SELECT * '
    if (args.where.OR === undefined)
      query += `from ${table} WHERE ${objectToWhereClause(args.where)}`

    if (args.where.OR !== undefined)
      query += `from ${table} WHERE ${objectToOrClause(args.where.OR)}`
  }

  if (args.offset && !args.limit)
    query += ` LIMIT -1 OFFSET ${args.offset}`

  if (args.sort) {
    const orders: string[] = []
    query += ' ORDER BY '
    for (const [key, value] of Object.entries(args.sort))
      orders.push(`${key} ${value}`)
    query += orders.join(', ')
  }

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
  for (const [columnName, columnType] of Object.entries<DBEntry<DBTypes>>(sortKeys([obj])[0])) {
    result += columnName

    if (columnType.type !== 'varchar' && columnType.type !== 'char' && columnType.type !== 'primary')
      result += ` ${columnType.type}`

    if (columnType.type === 'primary')
      result += ' INTEGER'

    if ((columnType.type === 'varchar' && 'size' in columnType) || (columnType.type === 'char' && 'size' in columnType))
      result += ` ${columnType.type}(${columnType.size})`
    if (columnType.type === 'primary')
      result += processPrimaryType(columnType)
    else
      result += processNonPrimaryType(columnType)

    result += ', '
  }

  result = result.slice(0, -2)
  return result
}

function processPrimaryType(columnType: DBEntry<DBTypes>) {
  let result = ' PRIMARY KEY'

  if (columnType.autoincrement)
    result += ' AUTOINCREMENT'

  result += ' NOT NULL UNIQUE'

  return result
}

function processNonPrimaryType(columnType: DBEntry<Omit<DBTypes, 'primary'>>) {
  let result = ''
  if (columnType.primary)
    result += ' PRIMARY KEY'

  if (columnType.autoincrement)
    result += ' AUTOINCREMENT'

  result += ' NOT NULL'
  if (columnType.nullable === true)
    result = result.replace(' NOT NULL', '')

  if (columnType.unique)
    result += ' UNIQUE'
  return result
}

export function formatInsertStatementLibSQL<T extends Record<string, any>>(table: string, structs: T[]) {
  const sortedStructs = sortKeys(structs)
  const flattenedInsert = sortedStructs.map(obj => Object.values(obj))
  const flattenedKeys = sortedStructs.map(obj => Object.keys(obj))[0]
  let insertions: string = ''
  insertions += `INSERT INTO ${table} `

  let tableKeys = ''
  for (const key of flattenedKeys)
    tableKeys += `${key}, `

  tableKeys = tableKeys.slice(0, -2)
  tableKeys.trim()
  tableKeys = `(${tableKeys}) `

  insertions += tableKeys
  insertions += 'VALUES '

  for (const insert of flattenedInsert) {
    let row: T | string[] = []
    for (const cell of insert) {
      if (typeof cell !== 'string')
        row = [...row, cell]

      if (typeof cell === 'string')
        row = [...row, `\'${cell}\'`]
    }
    insertions += `(${row}), `
  }
  insertions = insertions.slice(0, -2)
  insertions.trim()
  insertions += ';'
  return insertions
}
