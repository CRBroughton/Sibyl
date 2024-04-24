import { describe, expect, it } from 'bun:test'
import sql from 'sql.js'
import Sibyl from '../index'
import type { SibylResponse } from '../../types'

interface TableRow {
  id: number
  location: string
  name: string
  booleanTest: boolean
}

interface Tables {
  first: TableRow
}

describe('update tests', () => {
  it('updates an entry in the DB', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { createTable, Insert, Update } = await Sibyl<Tables>(db)

    createTable('first', {
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
      },
      location: {
        type: 'char',
        size: 8,
      },
      name: {
        type: 'char',
        size: 4,
      },
      booleanTest: {
        type: 'bool',
      },
    })
    Insert('first', [
      {
        name: 'Craig',
        id: 2344,
        location: 'Brighton',
        booleanTest: true,
      },
      {
        name: 'Bob',
        id: 1,
        location: 'Cornwall',
        booleanTest: false,
      },
    ])

    const actual = Update('first', {
      where: {
        id: 2344,
      },
      updates: {
        name: 'Richard',
        booleanTest: false,
      },
    })
    const expectation: SibylResponse<TableRow> = {
      id: 2344,
      location: 'Brighton',
      name: 'Richard',
      booleanTest: 0,
    }
    expect(actual).toStrictEqual(expectation)
  })
})
