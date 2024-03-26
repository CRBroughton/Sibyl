import { describe, expect, it } from 'vitest'
import { convertCreateTableStatement } from '../../sibylLib'
import type { DBNumber, DBString, DBValue } from '../types'

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
})
