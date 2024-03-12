import { describe, expect, it } from 'vitest'
import sql from 'sql.js'
import Sibyl from '../index'

interface TableRow {
  id: number
  location: string
  name: string
}

interface Tables {
  first: TableRow
}

describe('all tests', () => {
  it('returns all data available in the given table', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { createTable, Insert, All } = await Sibyl<Tables>(db)

    createTable('first', {
      id: 'int',
      location: 'char',
      name: 'char',
    })

    Insert('first', [
      {
        id: 1,
        name: 'Craig',
        location: 'Brighton',
      },
      {
        id: 2,
        name: 'Bob',
        location: 'Cornwall',
      },
    ])

    const actual = All('first')

    const expectation = [
      {
        id: 1,
        location: 'Brighton',
        name: 'Craig',
      },
      {
        id: 2,
        location: 'Cornwall',
        name: 'Bob',
      },
    ]

    expect(actual).toStrictEqual(expectation)
  })
})
