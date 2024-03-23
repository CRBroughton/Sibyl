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

describe('select tests', () => {
  it('select an entry in the DB', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
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
        primary: false,
        nullable: false,
        type: 'char',
        unique: false,
      },
      name: {
        primary: false,
        nullable: false,
        type: 'char',
        unique: false,
      },
      booleanTest: {
        primary: false,
        nullable: false,
        type: 'bool',
        unique: false,
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

    const expectation = [{
      id: 2344,
      location: 'Brighton',
      name: 'Craig',
      booleanTest: 1,
    }]
    expect(actual).toStrictEqual(expectation)
  })
  it('selects multiple entries in the DB', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { createTable, Insert, Select } = await Sibyl<Tables>(db)

    createTable('first', {
      id: 'int',
      location: 'char',
      name: 'char',
      booleanTest: 'bool',
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

    const expectation = [
      {
        id: 2344,
        location: 'Brighton',
        name: 'Craig',
        booleanTest: 1,
      },
      {
        name: 'Bob',
        id: 1,
        location: 'Brighton',
        booleanTest: 0,
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('selects multiple entries with the OR statement', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { createTable, Insert, Select } = await Sibyl<Tables>(db)

    createTable('first', {
      id: 'int',
      location: 'char',
      name: 'char',
      booleanTest: 'bool',
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

    const expectation = [
      {
        name: 'Craig',
        id: 2344,
        location: 'Brighton',
        booleanTest: 1,
      },
      {
        name: 'Chris',
        id: 2,
        location: 'Cornwall',
        booleanTest: 0,
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('selects multiple entries with the OR statement (mixed object)', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
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
      booleanTest: {
        type: 'bool',
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

    const expectation = [
      {
        name: 'Craig',
        id: 2344,
        location: 'Brighton',
        booleanTest: 1,
      },
      {
        name: 'Chris',
        id: 2,
        location: 'Cornwall',
        booleanTest: 0,
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
})
