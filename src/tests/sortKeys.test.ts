import { describe, expect, it } from 'vitest'
import sql from 'sql.js'
import { Sibyl } from '../index'

interface TableRow {
    id: number
    name: string
    location: string
}

describe('objectToWhereClause tests', () => {
    it('Formats a given set of array of objects alphabetically by their keys', async () => {
        const DBName = 'testingDB'
        const SQL = await sql({
            locateFile: () => {
                return 'playground/public/sql-wasm.wasm'
            },
        })
        const db = new SQL.Database()
        const { sortKeys } = await Sibyl<TableRow>(db, DBName)

        const unsortedArray = [
            {
                name: 'Craig',
                id: 1,
                location: 'Brighton'
            },
            {
                location: 'Cornwall',
                name: 'Bob',
                id: 2,
            }
        ]
        const actual = sortKeys(unsortedArray)

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
            }
        ]
        expect(actual).toStrictEqual(expectation)
    })
})
