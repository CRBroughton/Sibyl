import { describe, expect, it } from 'vitest'
import { convertCreateTableStatement } from '../sibylLib'

interface TableRow {
  id: 'int'
  location: 'char'
  name: 'char'
}

describe('convertCreateTableStatement tests', () => {
  it('converts a table object to a statement', async () => {
    const actual = convertCreateTableStatement<TableRow>({
      name: 'char',
      id: 'int',
      location: 'char',
    })

    const expectation = 'id int, location char, name char'
    expect(actual).toStrictEqual(expectation)
  })
})
