import { describe, expect, it } from 'vitest'
import { objectToWhereClause } from '../sibylLib'

interface TableRow {
  id: number
  name: string
  location: string
  booleanTest: boolean
}

describe('objectToWhereClause tests', () => {
  it('converts a single where object clause to a SQL WHERE clause', async () => {
    const actual = objectToWhereClause<TableRow>({
      name: 'Craig',
    })

    const expectation = 'name = \'Craig\''

    expect(actual).toStrictEqual(expectation)
  })
  it('converts the where object with multiple WHERE clauses to a SQL WHERE clause', async () => {
    const actual = objectToWhereClause<TableRow>({
      id: 1,
      location: 'Brighton',
      name: 'Craig',
    })

    const expectation = 'id = \'1\' AND location = \'Brighton\' AND name = \'Craig\''

    expect(actual).toStrictEqual(expectation)
  })
  it('converts 0 and 1 booleans back into booleans when inserting into the database', async () => {
    const actual = objectToWhereClause<TableRow>({
      id: 1,
      location: 'Brighton',
      name: 'Craig',
      booleanTest: false,
    })

    const expectation = 'id = \'1\' AND location = \'Brighton\' AND name = \'Craig\' AND booleanTest = \'0\''

    expect(actual).toStrictEqual(expectation)
  })
})
