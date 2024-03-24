import sql from 'sql.js'
import { faker } from '@faker-js/faker'
import Sibyl from '@crbroughton/sibyl'

export interface Order {
  id: number
  product: string
  currency: string
  price: string
  booleanTest: boolean
  status: 'processing' | 'completed' | 'failed'
}

interface Tables {
  orders: Order
}

const SQL = await sql({
  locateFile: () => {
    return '/sql-wasm.wasm'
  },
})
const db = new SQL.Database()
const { createTable, Insert, All, Select, Create, Update } = await Sibyl<Tables>(db)

createTable('orders', {
  currency: {
    type: 'char',
  },
  product: {
    type: 'char',
  },
  id: {
    autoincrement: true,
    type: 'INTEGER',
    primary: true,
  },
  price: {
    type: 'char',
  },
  booleanTest: {
    type: 'bool',
  },
  status: {
    type: 'varchar',
  },
})

const insertions: Order[] = []
for (let index = 0; index < 10000; index++) {
  insertions.push({
    id: faker.number.int(),
    product: faker.commerce.product(),
    currency: faker.finance.currency().name,
    price: faker.commerce.price(),
    booleanTest: false,
    status: 'completed',
  })
}
for (let index = 0; index < 10; index++) {
  insertions.push({
    id: faker.number.int(),
    product: faker.commerce.product(),
    currency: faker.finance.currency().name,
    price: faker.commerce.price(),
    booleanTest: false,
    status: 'processing',
  })
}
for (let index = 0; index < 10; index++) {
  insertions.push({
    id: faker.number.int(),
    product: faker.commerce.product(),
    currency: faker.finance.currency().name,
    price: faker.commerce.price(),
    booleanTest: false,
    status: 'failed',
  })
}
Insert('orders', insertions)
Update('orders', {
  where: {
    id: 1,
  },
  updates: {
    booleanTest: true,
    product: 'asdasd',
  },
})

export {
  All,
  Select,
  Insert,
  Create,
  Update,
}
