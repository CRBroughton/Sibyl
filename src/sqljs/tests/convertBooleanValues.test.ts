import { describe, expect, it } from 'vitest'
import { convertBooleanValues } from '../sibylLib'

interface TableRow {
  id: number
  location: string
  name: string
  booleanTest: boolean
}

describe('convertBooleanValues tests', () => {
  it('converts any boolean values in the array to either 0 or 1', async () => {
    const actual = convertBooleanValues<TableRow>([
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
        name: 'Craig',
      },
    ])

    const expectation = [
      {
        id: 1,
        booleanTest: 0,
        location: 'Brighton',
        name: 'Craig',
      },
      {
        id: 2,
        booleanTest: 1,
        location: 'Leeds',
        name: 'Craig',
      },
    ]

    expect(actual).toStrictEqual(expectation)
  })
})
