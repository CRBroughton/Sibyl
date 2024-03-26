import { describe, expect, it } from 'bun:test'
import { sortKeys } from '../../sibylLib'

interface TableRow {
  id: number
  name: string
  location: string
}

describe('sortKeys tests', () => {
  it('formats a given set of array of objects alphabetically by their keys', async () => {
    const unsortedArray = [
      {
        name: 'Craig',
        id: 1,
        location: 'Brighton',
      },
      {
        location: 'Cornwall',
        name: 'Bob',
        id: 2,
      },
    ]
    const actual = sortKeys<TableRow>(unsortedArray)

    const expectation = [
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
    ]
    expect(actual).toStrictEqual(expectation)
  })
})
