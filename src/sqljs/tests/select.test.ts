/* eslint-disable unused-imports/no-unused-vars */
import { describe, expect, it } from 'bun:test'
import sql from 'sql.js'
import type { Equals, Expect } from '@crbroughton/ts-test-utils'
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
        type: 'INTEGER',
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
        primary: true,
        unique: true,
      },
      location: {
        type: 'char',
        size: 8,
      },
      name: {
        type: 'char',
        size: 8,
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
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
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
        size: 4,
      },
      hasReadTheReadme: {
        type: 'bool',
      },
      location: {
        type: 'char',
        size: 8,
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
            hasReadTheReadme: 1,
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
  it('selects using the limited option', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
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
        size: 10,
      },
      hasReadTheReadme: {
        type: 'bool',
      },
      location: {
        type: 'char',
        size: 10,
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
        name: 'Craig',
        hasReadTheReadme: 1,
      },
      limited: true,
    })

    // Type tests
    const singluarActual = actual![0]
    type ExpectedType = Omit<SibylResponse<firstTable>, 'id' | 'location'>
    type ResultType = Expect<Equals<typeof singluarActual, ExpectedType>>
    //   ^?

    const expectation: ExpectedType[] = [
      {
        hasReadTheReadme: 1,
        name: 'Craig',
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
})
