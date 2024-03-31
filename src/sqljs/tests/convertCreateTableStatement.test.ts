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
        nullable: false,
        primary: true,
        unique: true,
      },
      name: {
        type: 'char',
        nullable: false,
      },
    })

    const expectation = 'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name char NOT NULL'
    expect(actual).toStrictEqual(expectation)
  })
  it('converts a table object to a statement, with a varchar type', async () => {
    const actual = convertCreateTableStatement<TableRow>({
      id: {
        autoincrement: true,
        type: 'INTEGER',
        nullable: false,
        primary: true,
        unique: true,
      },
      name: {
        type: 'varchar',
        size: 200,
        nullable: false,
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
        nullable: false,
        primary: true,
        unique: true,
      },
      name: {
        type: 'varchar',
        size: 200,
        nullable: false,
      },
      location: {
        type: 'char',
      },
    })

    const expectation = 'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, location char, name varchar(200) NOT NULL'
    expect(actual).toStrictEqual(expectation)
  })
})
