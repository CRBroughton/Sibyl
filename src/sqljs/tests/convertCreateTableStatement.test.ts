import { describe, expect, it } from 'bun:test'
import { convertCreateTableStatement } from '../../sibylLib'
import type { DBNumber, DBString, DBValue } from '../../types'

interface TableRow {
  id: DBValue<DBNumber>
  name: DBValue<DBString>
}

describe('convertCreateTableStatement tests', () => {
  it('converts a table object to a statement', async () => {
    const actual = convertCreateTableStatement<TableRow>({
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
    })

    const expectation = 'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name char(10) NOT NULL'
    expect(actual).toStrictEqual(expectation)
  })
  it('converts a table object to a statement, with a varchar type', async () => {
    const actual = convertCreateTableStatement<TableRow>({
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
      },
      name: {
        type: 'varchar',
        size: 200,
      },
    })

    const expectation = 'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name varchar(200) NOT NULL'
    expect(actual).toStrictEqual(expectation)
  })
  it('converts a table object to a statement, with a varchar type and a char type', async () => {
    const actual = convertCreateTableStatement<TableRow & { location: DBValue<DBString> }>({
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
      },
      name: {
        type: 'varchar',
        size: 200,
      },
      location: {
        type: 'char',
        size: 10,
      },
    })
    const expectation = 'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, location char(10) NOT NULL, name varchar(200) NOT NULL'
    expect(actual).toStrictEqual(expectation)
  })
  it('converts a table object to a statement, with nullable values', async () => {
    const actual = convertCreateTableStatement<TableRow & { location: DBValue<DBString> }>({
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
        nullable: true,
      },
      name: {
        type: 'varchar',
        size: 200,
        nullable: true,
      },
      location: {
        type: 'char',
        size: 10,
      },
    })
    const expectation = 'id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, location char(10) NOT NULL, name varchar(200)'
    expect(actual).toStrictEqual(expectation)
  })
  it('converts a table object to a statement, with new primary type', async () => {
    const actual = convertCreateTableStatement<TableRow & { location: DBValue<DBString> }>({
      id: {
        autoincrement: true,
        type: 'primary',
      },
      name: {
        type: 'varchar',
        size: 200,
        nullable: true,
      },
      location: {
        type: 'char',
        size: 10,
      },
    })
    const expectation = 'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, location char(10) NOT NULL, name varchar(200)'
    expect(actual).toStrictEqual(expectation)
  })
})
