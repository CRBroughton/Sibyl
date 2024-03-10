import { describe, expect, it } from 'vitest'
import sql from 'sql.js'
import { Sibyl } from '../index'

interface TableRow {
  id: number
  location: string
  name: string
}

describe('formatInsertStatment tests', () => {
  it('correctly formats a single INSERT statement for the DB', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { formatInsertStatement } = await Sibyl<TableRow>(db, 'testing-DB')

    const actual = formatInsertStatement('test', [
      {
        id: 1,
        location: 'Brighton',
        name: 'Craig',
      },
    ])

    expect(actual).toStrictEqual('INSERT INTO test VALUES (1,"Brighton","Craig");')
  })
  it('correctly formats several INSERT statments for the DB', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { formatInsertStatement } = await Sibyl<TableRow>(db, 'testing-DB')

    const actual = formatInsertStatement('test', [
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
    ])

    expect(actual).toStrictEqual('INSERT INTO test VALUES (1,"Brighton","Craig"); INSERT INTO test VALUES (2,"Cornwall","Bob");')
  })
  it('catches incorrect insert keys being the wrong way around and fixes itself', async () => {
    const SQL = await sql({
      locateFile: () => {
        return 'playground/public/sql-wasm.wasm'
      },
    })
    const db = new SQL.Database()
    const { formatInsertStatement } = await Sibyl<TableRow>(db, 'testing-DB')

    const actual = formatInsertStatement('test', [
      {
        id: 1,
        name: 'Craig',
        location: 'Brighton',
      },
      {
        location: 'Cornwall',
        id: 2,
        name: 'Bob',
      },
    ])

    expect(actual).toStrictEqual('INSERT INTO test VALUES (1,"Brighton","Craig"); INSERT INTO test VALUES (2,"Cornwall","Bob");')
  })
})
