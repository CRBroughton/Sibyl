import { describe, expect, it } from 'vitest'
import { buildSelectQuery } from '../sibylLib'

interface TableRow {
  id: number
  name: string
  location: string
}

describe('buildSelectQuery tests', () => {
  it('builds a SELECT query with a single where clause, with no provided offset or limit', async () => {
    const actual = buildSelectQuery<TableRow>('test', {
      where: {
        id: 1,
      },
    })

    const expectation = `SELECT * from test WHERE id = '1';`

    expect(actual).toStrictEqual(expectation)
  })

  it('builds a SELECT query with multiple where clauses, with no provided offset or limit', async () => {
    const actual = buildSelectQuery<TableRow>('test', {
      where: {
        id: 1,
        name: 'Craig',
        location: 'Brighton',
      },
    })

    const expectation = `SELECT * from test WHERE id = '1' AND name = 'Craig' AND location = 'Brighton';`

    expect(actual).toStrictEqual(expectation)
  })

  it('builds a SELECT query with multiple where clauses, with a provided limit, and no offset', async () => {
    const actual = buildSelectQuery<TableRow>('test', {
      where: {
        id: 1,
        name: 'Craig',
        location: 'Brighton',
      },
      limit: 10,
    })

    const expectation = `SELECT * from test WHERE id = '1' AND name = 'Craig' AND location = 'Brighton' LIMIT 10;`

    expect(actual).toStrictEqual(expectation)
  })

  it('builds a SELECT query with multiple where clauses, with a provided offset, and no limit', async () => {
    const actual = buildSelectQuery<TableRow>('test', {
      where: {
        id: 1,
        name: 'Craig',
        location: 'Brighton',
      },
      offset: 10,
    })

    const expectation = `SELECT * from test WHERE id = '1' AND name = 'Craig' AND location = 'Brighton' LIMIT -1 OFFSET 10;`

    expect(actual).toStrictEqual(expectation)
  })

  it('builds a SELECT query with multiple where clauses, with a provided offset and limit', async () => {
    const actual = buildSelectQuery<TableRow>('test', {
      where: {
        id: 1,
        name: 'Craig',
        location: 'Brighton',
      },
      limit: 10,
      offset: 10,
    })

    const expectation = `SELECT * from test WHERE id = '1' AND name = 'Craig' AND location = 'Brighton' LIMIT 10 OFFSET 10;`

    expect(actual).toStrictEqual(expectation)
  })
})
