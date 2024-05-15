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

describe('all tests', () => {
  it('returns all data available in the given table', async () => {
    const db = new Database(':memory:')
    const { createTable, Insert, All } = await Sibyl<Tables>(db)

    createTable('first', {
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
      },
      location: {
        type: 'char',
      },
      name: {
        type: 'char',
      },
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
  it('returns all data available in the given table and sorts then in ascending order by ID', async () => {
    const db = new Database(':memory:')
    const { createTable, Insert, All } = await Sibyl<Tables>(db)

    createTable('first', {
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
      },
      location: {
        type: 'char',
      },
      name: {
        type: 'char',
      },
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

    const actual = All('first', {
      sort: {
        id: 'ASC',
      },
    })

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
  it('returns all data available in the given table and sorts then in descending order by ID', async () => {
    const db = new Database(':memory:')
    const { createTable, Insert, All } = await Sibyl<Tables>(db)

    createTable('first', {
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
      },
      location: {
        type: 'char',
      },
      name: {
        type: 'char',
      },
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

    const actual = All('first', {
      sort: {
        id: 'DESC',
      },
    })

    const expectation = [
      {
        id: 2,
        location: 'Cornwall',
        name: 'Bob',
      },
      {
        id: 1,
        location: 'Brighton',
        name: 'Craig',
      },
    ]

    expect(actual).toStrictEqual(expectation)
  })
})
