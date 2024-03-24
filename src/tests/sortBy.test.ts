import { describe, expect, it } from 'vitest'
import { sortBy } from '../sibylLib'

interface TableRow {
  id: number
  location: string
  name: string
  booleanTest: boolean
}

describe('sortBy tests', () => {
  it('sorts an array of objects by name in ascending order', async () => {
    const actual = sortBy<TableRow>([
      {
        id: 2,
        booleanTest: true,
        location: 'Leeds',
        name: 'Bob',
      },
      {
        id: 1,
        booleanTest: false,
        location: 'Brighton',
        name: 'Craig',
      },
    ], 'name', 'ASC')

    const expectation = [
      {
        id: 2,
        booleanTest: true,
        location: 'Leeds',
        name: 'Bob',
      },
      {
        id: 1,
        booleanTest: false,
        location: 'Brighton',
        name: 'Craig',
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('sorts an array of objects by name in descending order', async () => {
    const actual = sortBy<TableRow>([
      {
        id: 2,
        booleanTest: true,
        location: 'Leeds',
        name: 'Bob',
      },
      {
        id: 1,
        booleanTest: false,
        location: 'Brighton',
        name: 'Craig',
      },
    ], 'name', 'DESC')

    const expectation = [
      {
        id: 1,
        booleanTest: false,
        location: 'Brighton',
        name: 'Craig',
      },
      {
        id: 2,
        booleanTest: true,
        location: 'Leeds',
        name: 'Bob',
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('sorts an array of objects by id in ascending order', async () => {
    const actual = sortBy<TableRow>([
      {
        id: 2,
        booleanTest: true,
        location: 'Leeds',
        name: 'Bob',
      },
      {
        id: 1,
        booleanTest: false,
        location: 'Brighton',
        name: 'Craig',
      },
    ], 'id', 'ASC')

    const expectation = [
      {
        id: 1,
        booleanTest: false,
        location: 'Brighton',
        name: 'Craig',
      },
      {
        id: 2,
        booleanTest: true,
        location: 'Leeds',
        name: 'Bob',
      },

    ]
    expect(actual).toStrictEqual(expectation)
  })
  it('sorts an array of objects by id in descending order', async () => {
    const actual = sortBy<TableRow>([
      {
        id: 2,
        booleanTest: true,
        location: 'Leeds',
        name: 'Bob',
      },
      {
        id: 1,
        booleanTest: false,
        location: 'Brighton',
        name: 'Craig',
      },
    ], 'id', 'DESC')

    const expectation = [
      {
        id: 2,
        booleanTest: true,
        location: 'Leeds',
        name: 'Bob',
      },
      {
        id: 1,
        booleanTest: false,
        location: 'Brighton',
        name: 'Craig',
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
})
