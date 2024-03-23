import { describe, expect, it } from 'vitest'
import { objectToOrClause } from '../sibylLib'

interface TableRow {
  id: number
  name: string
  location: string
}

describe('objectToOrClause tests', () => {
  it('converts the or objects with single OR clauses to a SQL OR clause', async () => {
    const actual = objectToOrClause<TableRow>([
      {
        id: 1,
      },
      {
        location: 'Brighton',
      },
    ])

    const expectation = `id = '1' OR location = 'Brighton'`

    expect(actual).toStrictEqual(expectation)
  })
  it('converts the or objects with multiple OR clauses to a SQL OR clause', async () => {
    const actual = objectToOrClause<TableRow>([
      {
        id: 1,
        location: 'Brighton',
      },
    ])

    const expectation = `id = '1' OR location = 'Brighton'`

    expect(actual).toStrictEqual(expectation)
  })
  it('converts the or objects with multiple OR clauses to a SQL OR clause, multiple objects', async () => {
    const actual = objectToOrClause<TableRow>([
      {
        id: 1,
        location: 'Brighton',
      },
      {
        location: 'Leeds',
      },
    ])

    const expectation = `id = '1' OR location = 'Brighton' OR location = 'Leeds'`

    expect(actual).toStrictEqual(expectation)
  })
})
