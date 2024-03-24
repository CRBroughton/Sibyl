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

describe('delete tests', () => {
  it('deletes an entry in the DB', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { createTable, Insert, All, Delete } = await Sibyl<Tables>(db)

    createTable('first', {
      id: {
        autoincrement: true,
        type: 'INTEGER',
        nullable: false,
        primary: true,
        unique: true,
      },
      location: {
        type: 'char',
        nullable: false,
        primary: false,
        unique: false,
      },
      name: {
        type: 'char',
        nullable: false,
        primary: false,
        unique: false,
      },
    })
    Insert('first', [
      {
        name: 'Craig',
        id: 2344,
        location: 'Brighton',
      },
      {
        id: 1,
        name: 'Bob',
        location: 'Cornwall',
      },
    ])

    let actual = All('first')

    let expectation = [
      {
        id: 1,
        name: 'Bob',
        location: 'Cornwall',
      },
      {
        name: 'Craig',
        id: 2344,
        location: 'Brighton',
      },
    ]
    expect(actual).toStrictEqual(expectation)

    Delete('first', {
      where: {
        id: 2344,
        name: 'Craig',
      },
    })
    actual = All('first')
    expectation = [
      {
        id: 1,
        name: 'Bob',
        location: 'Cornwall',
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
})
