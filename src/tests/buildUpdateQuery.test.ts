import { describe, expect, it } from 'vitest'
import { buildUpdateQuery } from '../sibylLib'

interface TableRow {
  id: number
  location: string
  name: string
  booleanTest: boolean
}

describe('buildUpdateQuery tests', () => {
  it('builds an update query with a singluar where and singular update clause', async () => {
    const actual = buildUpdateQuery<'test', TableRow>('testTable', {
      where: {
        id: 1,
      },
      updates: {
        name: 'Bill',
      },
    })

    const expectation = `UPDATE testTable SET name = 'Bill' WHERE id = '1';`
    expect(actual).toStrictEqual(expectation)
  })
  it('builds an update query with a singular where and multiple update clause', async () => {
    const actual = buildUpdateQuery<TableRow>('testTable', {
      where: {
        id: 1,
      },
      updates: {
        name: 'Bill',
        location: 'Brighton',
      },
    })

    const expectation = `UPDATE testTable SET name = 'Bill', location = 'Brighton' WHERE id = '1';`
    expect(actual).toStrictEqual(expectation)
  })
  it('builds an update query with multiple where clauses and a single update clause', async () => {
    const actual = buildUpdateQuery<TableRow>('testTable', {
      where: {
        id: 1,
        name: 'Craig',
      },
      updates: {
        location: 'Brighton',
      },
    })

    const expectation = `UPDATE testTable SET location = 'Brighton' WHERE id = '1' AND name = 'Craig';`
    expect(actual).toStrictEqual(expectation)
  })
  it('builds an update query with multiple updates and multiple where clauses to update an entry in the database', async () => {
    const actual = buildUpdateQuery<TableRow>('testTable', {
      where: {
        id: 1,
        name: 'Craig',
      },
      updates: {
        name: 'Bill',
        location: 'Brighton',
      },
    })

    const expectation = `UPDATE testTable SET name = 'Bill', location = 'Brighton' WHERE id = '1' AND name = 'Craig';`
    expect(actual).toStrictEqual(expectation)
  })
})
