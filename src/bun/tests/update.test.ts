import { describe, expect, it } from 'bun:test'
import { Database } from 'bun:sqlite'
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
    const db = new Database(':memory:')
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
      },
      name: {
        type: 'char',
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
      booleanTest: 0,
      id: 2344,
      location: 'Brighton',
      name: 'Richard',
    }
    expect(actual).toStrictEqual(expectation)
  })
})
