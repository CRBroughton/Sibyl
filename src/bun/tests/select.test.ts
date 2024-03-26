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

describe('select tests', () => {
  it('select an entry in the DB', async () => {
    const db = new Database(':memory:')
    const { createTable, Create, Select } = await Sibyl<Tables>(db)

    createTable('first', {
      id: {
        primary: true,
        autoincrement: true,
        nullable: false,
        type: 'INTEGER',
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
    Create('first', {
      name: 'Craig',
      id: 2344,
      location: 'Brighton',
      booleanTest: true,
    })

    const actual = Select('first', {
      where: {
        id: 2344,
      },
    })

    const expectation: SibylResponse<TableRow>[] = [{
      id: 2344,
      location: 'Brighton',
      name: 'Craig',
      booleanTest: 1,
    }]
    expect(actual).toStrictEqual(expectation)
  })
  it('selects multiple entries in the DB', async () => {
    const db = new Database(':memory:')
    const { createTable, Insert, Select } = await Sibyl<Tables>(db)

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
        location: 'Brighton',
        booleanTest: false,
      },
    ])

    const actual = Select('first', {
      where: {
        location: 'Brighton',
      },
    })

    const expectation: SibylResponse<TableRow>[] = [
      {
        name: 'Bob',
        id: 1,
        location: 'Brighton',
        booleanTest: 0,
      },
      {
        id: 2344,
        location: 'Brighton',
        name: 'Craig',
        booleanTest: 1,
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('selects multiple entries with the OR statement', async () => {
    const db = new Database(':memory:')
    const { createTable, Insert, Select } = await Sibyl<Tables>(db)

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
        location: 'Leeds',
        booleanTest: false,
      },
      {
        name: 'Chris',
        id: 2,
        location: 'Cornwall',
        booleanTest: false,
      },
    ])

    const actual = Select('first', {
      where: {
        OR: [
          {
            location: 'Cornwall',
          },
          {
            location: 'Brighton',
          },
        ],
      },
    })

    const expectation: SibylResponse<TableRow>[] = [
      {
        name: 'Chris',
        id: 2,
        location: 'Cornwall',
        booleanTest: 0,
      },
      {
        name: 'Craig',
        id: 2344,
        location: 'Brighton',
        booleanTest: 1,
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('selects multiple entries with the OR statement (mixed object)', async () => {
    const db = new Database(':memory:')
    const { createTable, Insert, Select } = await Sibyl<Tables>(db)

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
        location: 'Leeds',
        booleanTest: false,
      },
      {
        name: 'Chris',
        id: 2,
        location: 'Cornwall',
        booleanTest: false,
      },
    ])

    const actual = Select('first', {
      where: {
        OR: [
          {
            location: 'Cornwall',
            id: 2344,
          },
        ],
      },
    })

    const expectation: SibylResponse<TableRow>[] = [
      {
        name: 'Chris',
        id: 2,
        location: 'Cornwall',
        booleanTest: 0,
      },
      {
        name: 'Craig',
        id: 2344,
        location: 'Brighton',
        booleanTest: 1,
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('selects multiple entries with the OR statement and sorts them in ascending order by id', async () => {
    const db = new Database(':memory:')
    const { createTable, Insert, Select } = await Sibyl<Tables>(db)

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
        location: 'Brighton',
        booleanTest: false,
      },
      {
        name: 'Chris',
        id: 2,
        location: 'Cornwall',
        booleanTest: false,
      },
    ])

    const actual = Select('first', {
      where: {
        location: 'Brighton',
      },
      sort: {
        id: 'ASC',
      },
    })

    const expectation: SibylResponse<TableRow>[] = [
      {
        id: 1,
        location: 'Brighton',
        name: 'Bob',
        booleanTest: 0,
      },
      {
        name: 'Craig',
        id: 2344,
        location: 'Brighton',
        booleanTest: 1,
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('selects using boolean value', async () => {
    const db = new Database(':memory:')
    // Create table schema
    interface firstTable {
      id: number
      name: string
      location: string
      hasReadTheReadme: boolean
    }
    interface Tables {
      firstTable: firstTable
    }
    const { createTable, Insert, Select } = await Sibyl<Tables>(db)

    createTable('firstTable', {
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
      },
      name: {
        type: 'char',
      },
      hasReadTheReadme: {
        type: 'bool',
      },
      location: {
        type: 'char',
      },
    })

    Insert('firstTable', [
      {
        id: 1,
        hasReadTheReadme: true,
        location: 'Brighton',
        name: 'Craig',
      },
      {
        id: 2,
        hasReadTheReadme: false,
        location: 'Leeds',
        name: 'Bob',
      },
      {
        id: 3,
        hasReadTheReadme: true,
        location: 'Brighton',
        name: 'David',
      },
    ])

    const actual = Select('firstTable', {
      where: {
        OR: [
          {
            name: 'Craig',
          },
          {
            hasReadTheReadme: true,
          },
        ],
      },
    })
    const expectation: SibylResponse<firstTable>[] = [
      {
        id: 1,
        hasReadTheReadme: 1,
        location: 'Brighton',
        name: 'Craig',
      },
      {
        id: 3,
        hasReadTheReadme: 1,
        location: 'Brighton',
        name: 'David',
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
})
