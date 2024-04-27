import { describe, expect, it } from 'bun:test'
import { Database } from 'bun:sqlite'
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
    const db = new Database(':memory:')
    const { createTable, Insert, All, Delete } = await Sibyl<Tables>(db)

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
