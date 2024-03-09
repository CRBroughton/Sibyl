# Sibyl

Sibyl is a lightweight SQLite query builder for <a href="https://github.com/sql-js/sql.js">SQL.js</a>, providing a Prisma-like query builder. Sibyl is in early development,
so expect breaking changes and rapid development.

## Getting Started

### Installation

Sibyl depends on `sql.js`, which provides the lower-level API to interact with your
embedded SQLite database. You'll also need to install the `.wasm` file that `sql.js`
provide; Please see their documentation at https://sql.js.org.

With the `.wasm` file now available, you can install Sibyl with the following command:

```bash
bun install sql.js @types/sql.js @crbroughton/sibyl 
```


You can download Sibyl at https://www.npmjs.com/package/@crbroughton/sibyl via NPM

To start off with Sibyl, you'll first have to ensure Sibyl is able to be run inside
of a top-level async/await file, alongside your `sql.js` database connection. As
referenced from the `sql.js` documentation, you can provide Sibyl a database instance
like so:

```typescript
interface tableRowType {
    id: number
    name: string
    sex: string
    job: string
}

const SQL = await sql({
    locateFile: () => {
        return '/sql-wasm.wasm'
    }
})
const db = new SQL.Database()

const { createTable, Insert, Select, All } = await Sibyl<tableRowType>(db, 'my-db')
```

With top-level async/await enabled, you can then use Sibyl. Sibyl provides the following
functions:

- `createTable` - Allows you to create the table
- `Insert` - Allows you to provide an array of insertable entries into your table
- `Select` - Returns a type-safe array of entries from the table
- `All` - Returns all entries from the table


### Creating the table

To create a new table (at the moment, it is recommended to only use one table),
use the `createTable` command:

```typescript
createTable('id int, name char, sex char, job char')
```

`createTable` takes a single argument; This argument will create the specified
columns for you database; It is vitally important that your columns match that of
your specified table row type you supply to Sibyl's root function, otherwise
you'll be unable to get data from your database, or crash your program.

### Inserting entries into the DB

To insert new entries into the database, you can use the `Insert` function:

```typescript
let insertions: tableRowType[] = []
for (let index = 0; index < 1000; index++) {
  insertions = [...insertions, 
    {
      id: faker.number.int(),
      name: faker.person.firstName(),
      sex: faker.person.sex(),
      job: faker.person.jobTitle(),
    },
  ]
}
const test = Insert('test', insertions) // formats the insertion instruction
db.run(test) // execute the provided instruction - Data will now be in the DB
```

### Selecting entries from the DB

When selecting entries from the database, you can utilise the `Select` function
to retrieve an array of type-safe entries, based from the generic interface
you have supplied to Sybil main function (see above `tableRowType`).

```typescript
selection.value = Select({
   where: {
    id: 1, 
    name: "Craig", // can conbine multiple where clauses
   },
   limit: 20, // limit the response from Sibyl
   offset: 10, // offset the response, useful for pagination
})
```


## Development

To install dependencies:

```bash
bun install
```

You can then try Sibyl in the playground, first install the dependencies:

```bash
cd playground && bun install
```

and then run the playground:
```bash
bun run dev
```

This project was created using `bun init` in bun v1.0.29. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
