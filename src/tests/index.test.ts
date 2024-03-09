import { expect, test } from 'vitest'
import { Sibyl } from '../index'

test('Builds a SELECT query with multiple where clauses, with no provided offet or limit', async() => {
    const DBName = 'testing-DB'
    const { buildSelectQuery } = await Sibyl('testing-DB', 'playground/public/sql-wasm.wasm')

    const actual = buildSelectQuery({
        where: {
            id: 1,
            name: "Craig",
            location: "Brighton"
        }
    })

    const expectation = `SELECT * from ${DBName} WHERE id = '1' AND name = 'Craig' AND location = 'Brighton'`

    expect(actual).toStrictEqual(expectation)
})