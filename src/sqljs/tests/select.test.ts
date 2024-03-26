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
})
