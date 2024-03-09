import { describe, expect, test } from 'vitest'
import sql from 'sql.js'
import { Sibyl } from '../index'

interface TableRow {
    id: number
    name: string
    location: string
}

describe('buildSelectQuery tests', () => {
    test('Builds a SELECT query with a single where clause, with no provided offset or limit', async() => {
        const DBName = 'testing-DB'
        const SQL = await sql({
            locateFile: () => {
                return 'playground/public/sql-wasm.wasm'
            }
        })
        const db = new SQL.Database()
        const { buildSelectQuery } = await Sibyl<TableRow>(db, 'testing-DB')
    
        const actual = buildSelectQuery({
            where: {
                id: 1,
            }
        })
    
        const expectation = `SELECT * from ${DBName} WHERE id = '1';`
    
        expect(actual).toStrictEqual(expectation)
    })
    
    test('Builds a SELECT query with multiple where clauses, with no provided offset or limit', async() => {
        const DBName = 'testing-DB'
        const SQL = await sql({
            locateFile: () => {
                return 'playground/public/sql-wasm.wasm'
            }
        })
        const db = new SQL.Database()
        const { buildSelectQuery } = await Sibyl<TableRow>(db, 'testing-DB')
    
        const actual = buildSelectQuery({
            where: {
                id: 1,
                name: "Craig",
                location: "Brighton"
            }
        })
    
        const expectation = `SELECT * from ${DBName} WHERE id = '1' AND name = 'Craig' AND location = 'Brighton';`
    
        expect(actual).toStrictEqual(expectation)
    })
    
    test('Builds a SELECT query with multiple where clauses, with a provided limit, and no offset', async() => {
        const DBName = 'testing-DB'
        const SQL = await sql({
            locateFile: () => {
                return 'playground/public/sql-wasm.wasm'
            }
        })
        const db = new SQL.Database()
        const { buildSelectQuery } = await Sibyl<TableRow>(db, 'testing-DB')

        const actual = buildSelectQuery({
            where: {
                id: 1,
                name: "Craig",
                location: "Brighton"
            },
            limit: 10,
        })
    
        const expectation = `SELECT * from ${DBName} WHERE id = '1' AND name = 'Craig' AND location = 'Brighton' LIMIT 10;`
    
        expect(actual).toStrictEqual(expectation)
    })
    
    test('Builds a SELECT query with multiple where clauses, with a provided offset, and no limit', async() => {
        const DBName = 'testing-DB'
        const SQL = await sql({
            locateFile: () => {
                return 'playground/public/sql-wasm.wasm'
            }
        })
        const db = new SQL.Database()
        const { buildSelectQuery } = await Sibyl<TableRow>(db, 'testing-DB')
    
        const actual = buildSelectQuery({
            where: {
                id: 1,
                name: "Craig",
                location: "Brighton"
            },
            offset: 10,
        })
    
        const expectation = `SELECT * from ${DBName} WHERE id = '1' AND name = 'Craig' AND location = 'Brighton' LIMIT -1 OFFSET 10;`
    
        expect(actual).toStrictEqual(expectation)
    })
    
    test('Builds a SELECT query with multiple where clauses, with a provided offset and limit', async() => {
        const DBName = 'testing-DB'
        const SQL = await sql({
            locateFile: () => {
                return 'playground/public/sql-wasm.wasm'
            }
        })
        const db = new SQL.Database()
        const { buildSelectQuery } = await Sibyl<TableRow>(db, 'testing-DB')
    
        const actual = buildSelectQuery({
            where: {
                id: 1,
                name: "Craig",
                location: "Brighton"
            },
            limit: 10,
            offset: 10,
        })
    
        const expectation = `SELECT * from ${DBName} WHERE id = '1' AND name = 'Craig' AND location = 'Brighton' LIMIT 10 OFFSET 10;`
    
        expect(actual).toStrictEqual(expectation)
    })
})
