import sql from 'sql.js'

export async function Sibyl<T extends Record<string, any>>(table: string, wasm: string) {
    const SQL = await sql({
        locateFile: () => {
            return wasm
        }
    })
    const db = new SQL.Database()

    function createTable(columns: string) {
        db.run(`CREATE TABLE ${table} (${columns});`)
    }

    function Insert<T extends Record<string, any>>(table: string, structs: T[]) {
        const flattenedInsert =  structs.map((obj) => Object.values(obj))
        let insertions: string = ''
        for (const insert of flattenedInsert){
            let row: any[] = []
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
        insertions.trim()
        return insertions
    }

    function objectToWhereClause(obj: Partial<T>): string {
        const clauses = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clauses.push(`${key} = '${obj[key]}'`);
            }
        }
        return clauses.join(' AND ');
    }

    interface SelectArgs<T> {
        where: Partial<T>
        offset?: number
        limit?: number
    }
    function buildSelectQuery(args: SelectArgs<T>){
        let query = `SELECT * from ${table} WHERE ${objectToWhereClause(args.where)}`

        if (args.offset && !args.limit) {
            query += `LIMIT -1 OFFSET ${args.offset};`
        }
        if (args.offset && args.limit) {
            query += `LIMIT ${args.limit} OFFSET ${args.offset};`
        }
        if (!args.offset && args.limit) {
            query += `LIMIT ${args.limit};`
        }
        return query
    }
    function Select(args: SelectArgs<T>) {
        const query = buildSelectQuery(args)
        const record = db.exec(query)

        return {
            columns: record[0] ? record[0].columns : [],
            values: record[0] ? record[0].values : [],
        }
    }

    function All() {
      const result = db.exec(`SELECT * from ${table}`)

      if (result !== undefined) {
        return result[0]
      }
      return undefined
    }

    return {
        db,
        createTable,
        Insert,
        Select,
        All,
    }
}