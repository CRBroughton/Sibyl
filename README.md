# Sibyl

Sibyl is a lightweight SQLite query builder for <a href="https://github.com/sql-js/sql.js">SQL.js</a> and <a href="https://bun.sh/docs/api/sqlite">Bun's sqlite3 driver</a>, providing a Prisma-like query builder. Sibyl is in early development,
so expect breaking changes and rapid development.

## Getting Started

### Installation

Dependant on your chosen SQLite driver, you'll want to follow one
of the following installation methods:

#### SQL.js Installation

If you choose to use Sibyl with `sql.js`, `sql.js` will provide the lower-level API to interact with your
embedded SQLite database. You'll also need to install the `.wasm` file that `sql.js`
provides; Please see their documentation at https://sql.js.org.

With the `.wasm` file now available, you can install Sibyl with the following command:

```bash
bun install sql.js @types/sql.js @crbroughton/sibyl
```

#### Bun Installation

If you are using Sibyl with Bun, you should already have access to the driver, and can refer to the <a href="https://bun.sh/docs/api/sqlite">
Bun documentation</a>. The Bun implemenation of Sibyl can be installed
with the following command:

```bash
bun install @crbroughton/sibyl:bun
```
Sibyl will then accept the native Bun SQLite `Database`, again, see the <a href="https://bun.sh/docs/api/sqlite">
Bun documentation</a>.

#### Getting Started

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
  hasReadTheReadme: boolean
}

interface secondRowType {
  id: number
}

interface Tables {
  firstTable: tableRowType
  secondTable: secondRowType
}

const SQL = await sql({ // sql.js implementation
  locateFile: () => {
    return '/sql-wasm.wasm'
  }
})
const db = new SQL.Database()

const { createTable, Insert, Select, All, Create } = await Sibyl<Tables>(db)
```

With top-level async/await enabled, you can then use Sibyl. Sibyl provides the following
functions:

- `createTable` - Allows you to create a table
- `Create` - Creates and returns a new entry into your selected table
- `Insert` - Allows you to provide an array of insertable entries into your selected table
- `Select` - Returns a type-safe array of entries from the selected table
- `All` - Returns all entries from the selected table
- `Update` Updates and returns a single entry from the selected table
- `Delete` - Deletes an entry from a selected table

### Creating the table

To create a new table, use the `createTable` command:

```typescript
createTable('firstTable', { // inferred table name and entry
  id: {
    autoincrement: true,
    type: 'INTEGER', // only allows for known data types ('int', 'char', 'blob')
    nullable: false,
    primary: true,
    unique: true,
  },
  job: {
    type: 'char',
  },
  name: {
    type: 'char',
  },
  sex: {
    type: 'char',
  },
  hasReadTheReadme: {
    type: 'bool',
  },
})
```

`createTable` takes two arguments, the first is the name of the table you wish to select, This
is based off the generic interface you first supplied to Sibyl.
The second argument will create the specified columns for your database. Sibyl will handle the order and creation of each column you have specified, and only allow known data types.

### Inserting a single entry into the DB

To create a new entry, you can use the `Create` function:

```typescript
const result = Create('firstTable', { // returns the resulting entry
    id: faker.number.int(),
    name: 'Craig',
    sex: 'male',
    job: 'Software Engineer',
    hasReadTheReadme: true,
})
```

### Inserting mutiple entries into the DB

To insert new entries into the database, you can use the `Insert` function:

```typescript
let insertions: SibylResponse<tableRowType>[] = []
for (let index = 0; index < 1000; index++) {
  insertions.push({
    id: faker.number.int(),
    name: faker.person.firstName(),
    sex: faker.person.sex(),
    job: faker.person.jobTitle(),
    hasReadTheReadme: true,
  })
}
// execute the provided instruction - Data will now be in the DB
const test = Insert('firstTable', insertions)
```

### Selecting entries from the DB

When selecting entries from the database, you can utilise the `Select` function
to retrieve an array of type-safe entries, based from the generic interface
you have supplied to Sybil main function (see above `tableRowType`).

```typescript
selection.value = Select('firstTable', {
   where: {
    id: 1,
    name: "Craig", // can combine multiple where clauses
   },
   limit: 20, // limit the response from Sibyl
   offset: 10, // offset the response, useful for pagination
})
```

#### OR Selection

When selecting entries from the database, the `Select` function, by
default, uses an AND statement to build you query. You can however,
include an optional OR array to select entries:

```typescript
const response = Select('firstTable', { // Returns all entries where name is Craig OR Bob
  where: {
    OR: [
      {
        name: 'Craig'
      },
      {
        name: 'Bob'
      }
    ]
  }
})
```

You can also combine multiple OR statements as part of a single object,
if the keys do no clash:

```typescript
const response = Select('firstTable', { // Returns all entries where name is Craig OR Bob OR hasReadTheReadme is false
  where: {
    OR: [
      {
        name: 'Craig',
        hasReadTheReadme: false,
      },
      {
        name: 'Bob'
      }
    ]
  }
})
```
When using the optional OR array to build a query, you can still use
the optional `offset` and `limit` keys.

### Updating an entry in the DB

To update a single entry in the database, you can use the `Update` function:

```typescript
const updatedEntry = Update('firstTable', { // infers the table and response type
   where: { // Can combine multiple where clauses
    id: 1,
    name: 'Craig',
   },
   updates: {
    name: 'Bob', // Can update multiple values at once
    job: 'Engineer',
   }
})
```

### Sibyl Responses

Sibyl also offers a custom type the `SibylResponse` type; This type can be helpful
when wanting to convert data types to TypeScript types; At the moment the custom type
only support boolean conversions from `boolean` to `0 | 1`. It's recommended to use
this type as a wrapper, if you're ever using boolean values.

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
