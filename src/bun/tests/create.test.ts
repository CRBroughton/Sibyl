import { describe, expect, it } from 'vitest'
import { Database } from 'bun:sqlite'
import bSibyl from '../index'

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
    const db = new Database(':memory:')
    const { createTable, Create } = await bSibyl<Tables>(db)

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
    const actual = Create('first', {
      name: 'Craig',
      id: 2344,
      location: 'Brighton',
      booleanTest: true,
    })
    const expectation = {
      id: 2344,
      location: 'Brighton',
      name: 'Craig',
      booleanTest: 1,
    }
    expect(expectation).toStrictEqual(actual)
  })
})
