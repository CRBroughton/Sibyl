/* eslint-disable unused-imports/no-unused-vars */
import { describe, expect, it } from 'bun:test'
import Database from 'libsql'
import type { Equals, Expect } from '@crbroughton/ts-test-utils'
import Sibyl from '../index'
import type { SibylResponse } from '../../types'

interface firstTable {
  id: number
  name: string
  location: string
  hasReadTheReadme: boolean
}
interface Tables {
  firstTable: firstTable
}

describe('LimitedSelect tests', () => {
  it('selects an entry from the DB, using the limited functionality', async () => {
    const db = new Database(':memory:')
    const { createTable, Insert, LimitedSelect } = await Sibyl<Tables>(db)

    createTable('firstTable', {
      id: {
        autoincrement: true,
        type: 'INTEGER',
        primary: true,
        unique: true,
      },
      name: {
        type: 'char',
        size: 10,
      },
      hasReadTheReadme: {
        type: 'bool',
      },
      location: {
        type: 'char',
        size: 10,
      },
    })

    Insert('firstTable', [
      {
        id: 1,
        hasReadTheReadme: true,
        location: 'Brighton',
        name: 'Craig',
      },
      {
        id: 2,
        hasReadTheReadme: false,
        location: 'Leeds',
        name: 'Bob',
      },
      {
        id: 3,
        hasReadTheReadme: true,
        location: 'Brighton',
        name: 'David',
      },
    ])

    const actual = LimitedSelect('firstTable', {
      where: {
        name: 'Craig',
        hasReadTheReadme: 1,
      },
    })

    // Type tests
    const singluarActual = actual![0]
    type ActualType = typeof singluarActual
    type ExpectedType = Omit<SibylResponse<firstTable>, 'id' | 'location'>
    type ResultType = Expect<Equals<ActualType, ExpectedType>>
    //   ^?

    const expectation: ExpectedType[] = [
      {
        hasReadTheReadme: 1,
        name: 'Craig',
      },
    ]
    expect(actual).toStrictEqual(expectation)
  })
})
