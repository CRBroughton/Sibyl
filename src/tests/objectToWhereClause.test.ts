import { describe, expect, it } from 'vitest'
import sql from 'sql.js'
import { Sibyl } from '../index'

interface TableRow {
  id: number
  name: string
  location: string
}

describe('objectToWhereClause tests', () => {
  it('converts a single where object clause to a SQL WHERE clause', async () => {
    const DBName = 'testingDB'
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { objectToWhereClause } = await Sibyl<TableRow>(db, DBName)

    const actual = objectToWhereClause({
      name: 'Craig',
    })

    const expectation = 'name = \'Craig\''

    expect(actual).toStrictEqual(expectation)
  })
  it('converts the where object with multiple WHERE clauses to a SQL WHERE clause', async () => {
    const DBName = 'testingDB'
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { objectToWhereClause } = await Sibyl<TableRow>(db, DBName)

    const actual = objectToWhereClause({
      id: 1,
      location: 'Brighton',
      name: 'Craig',
    })

    const expectation = 'id = \'1\' AND location = \'Brighton\' AND name = \'Craig\''

    expect(actual).toStrictEqual(expectation)
  })
})
