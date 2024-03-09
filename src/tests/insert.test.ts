import { describe, expect, test } from 'vitest'
import sql from 'sql.js'
import { Sibyl } from '../index'

interface TableRow {
    id: number
    name: string
    location: string
}

describe('insert tests', () => {
    test('Correctly formats a single INSERT statement for the DB', async() => {
        const SQL = await sql({
            locateFile: () => {
                return 'playground/public/sql-wasm.wasm'
            }
        })
        const db = new SQL.Database()
        const { Insert } = await Sibyl<TableRow>(db, 'testing-DB')
    
        const actual = Insert('test', [
            {
                id: 1,
                location: "Brighton",
                name: "Craig"
            }
        ])
    
        expect(actual).toStrictEqual('INSERT INTO test VALUES (1,"Brighton","Craig");')
    })
    test('Correctly formats several INSERT statments for the DB', async() => {
        const SQL = await sql({
            locateFile: () => {
                return 'playground/public/sql-wasm.wasm'
            }
        })
        const db = new SQL.Database()
        const { Insert } = await Sibyl<TableRow>(db, 'testing-DB')
    
        const actual = Insert('test', [
            {
                id: 1,
                location: "Brighton",
                name: "Craig"
            },
            {
                id: 2,
                location: "Cornwall",
                name: "Bob"
            }
        ])

        expect(actual).toStrictEqual('INSERT INTO test VALUES (1,"Brighton","Craig"); INSERT INTO test VALUES (2,"Cornwall","Bob");')
    })
})
