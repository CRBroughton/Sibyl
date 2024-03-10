import { describe, expect, it } from 'vitest'
import sql from 'sql.js'
import { Sibyl } from '../index'

interface TableRow {
  id: number
  location: string
  name: string
}

describe('create tests', () => {
  it('creates a new entry in the DB', async () => {
    const DBName = 'testingDB'
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { createTable, Create } = await Sibyl<TableRow>(db, 'testingDB')

    createTable('id int, location char, name char')
    const actual = Create(DBName, {
        name: "Craig",
        id: 2344,
        location: 'Brighton',
    })

    const expectation = {
        id: 2344,
        location: 'Brighton',
        name: 'Craig',
    }
    expect(actual).toStrictEqual(expectation)
  })
})
