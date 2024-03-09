import { type Database } from 'sql.js'

interface SelectArgs<T> {
    where: Partial<T>
    offset?: number
    limit?: number
}

interface DataStructure {
    columns: string[]
    values: any[][]
}

export async function Sibyl<T extends Record<string, any>>(db: Database, table: string) {
    function createTable(columns: string) {
        db.run(`CREATE TABLE ${table} (${columns});`)
    }

    function Insert(table: string, structs: T[]) {
        const flattenedInsert = structs.map((obj) => Object.values(obj))
        let insertions: string = ''
        for (const insert of flattenedInsert){
            let row: T | string[] = []
            for (const cell of insert) {
                if (typeof cell !== 'string') {
                    row = [...row, cell]
                }
                if (typeof cell === 'string') {
                    row = [...row, `"${cell}"`]
                }
            }
            insertions += `INSERT INTO ${table} VALUES (${row}); `
        }
        insertions.slice(0, -1)
        return insertions.trim()
    }

    function objectToWhereClause(obj: Partial<T>): string {
        const clauses = []
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clauses.push(`${key} = '${obj[key]}'`)
            }
        }
        return clauses.join(' AND ')
    }


    function buildSelectQuery(args: SelectArgs<T>){
        let query = `SELECT * from ${table} WHERE ${objectToWhereClause(args.where)}`

        if (args.offset && !args.limit) {
            query += ` LIMIT -1 OFFSET ${args.offset}`
        }
        if (args.offset && args.limit) {
            query += ` LIMIT ${args.limit} OFFSET ${args.offset}`
        }
        if (!args.offset && args.limit) {
            query += ` LIMIT ${args.limit}`
        }
        return query + ';'
    }

    function convertToObjects(data: DataStructure): T[] {
        const result: T[] = []
        for (const valueArray of data.values) {
            const obj: any = {}
            for (let i = 0; i < data.columns.length; i++) {
                obj[data.columns[i]] = valueArray[i]
            }
            result.push(obj)
        }
        return result
    }

    function Select(args: SelectArgs<T>) {
        const query = buildSelectQuery(args)
        const record = db.exec(query)

        if (record[0]) {
            return  convertToObjects({
                columns: record[0].columns,
                values: record[0].values
            })
        }

        return undefined
    }

    function All() {
      const result = db.exec(`SELECT * from ${table}`)

      if (result !== undefined) {
        return result[0]
      }
      return undefined
    }

    return {
        createTable,
        Insert,
        Select,
        All,
        buildSelectQuery,
        convertToObjects,
    }
}