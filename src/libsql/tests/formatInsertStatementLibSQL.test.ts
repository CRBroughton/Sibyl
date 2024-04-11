import { describe, expect, it } from 'bun:test'
import { formatInsertStatementLibSQL } from '../../sibylLib'

interface TableRow {
  id: number
  location: string
  name: string
}

describe('formatInsertStatmentLibSQL tests', () => {
  it('correctly formats a single INSERT statement for the DB', async () => {
    const actual = formatInsertStatementLibSQL<TableRow>('test', [
      {
        id: 1,
        location: 'Brighton',
        name: 'Craig',
      },
    ])

    expect(actual).toStrictEqual('INSERT INTO test (id, location, name) VALUES (1,\'Brighton\',\'Craig\');')
  })
  it('correctly formats several INSERT statments for the DB', async () => {
    const actual = formatInsertStatementLibSQL<TableRow>('test', [
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
    ])

    expect(actual).toStrictEqual('INSERT INTO test (id, location, name) VALUES (1,\'Brighton\',\'Craig\'), (2,\'Cornwall\',\'Bob\');')
  })
  it('catches incorrect insert keys being the wrong way around and fixes itself', async () => {
    const actual = formatInsertStatementLibSQL<TableRow>('test', [
      {
        id: 1,
        name: 'Craig',
        location: 'Brighton',
      },
      {
        location: 'Cornwall',
        id: 2,
        name: 'Bob',
      },
    ])

    expect(actual).toStrictEqual('INSERT INTO test (id, location, name) VALUES (1,\'Brighton\',\'Craig\'), (2,\'Cornwall\',\'Bob\');')
  })
})
