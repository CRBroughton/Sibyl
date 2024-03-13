import { describe, expect, it } from 'vitest'
import sql from 'sql.js'
import Sibyl from '../index'

interface TableRow {
  id: number
  location: string
  name: string
  booleanTest: boolean
}

interface Tables {
  first: TableRow
}

describe('create tests', () => {
  it('creates a new entry in the DB', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { createTable, Create } = await Sibyl<Tables>(db)

    createTable('first', {
      id: 'int',
      location: 'char',
      name: 'char',
      booleanTest: 'bool',
    })
    const actual = Create('first', {
      name: 'Craig',
      id: 2344,
      location: 'Brighton',
      booleanTest: true,
    })

    const expectation: TableRow = {
      id: 2344,
      location: 'Brighton',
      name: 'Craig',
      booleanTest: true,
    }
    expect(actual).toStrictEqual(expectation)
  })
})
