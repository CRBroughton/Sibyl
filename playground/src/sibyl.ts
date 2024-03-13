import sql from 'sql.js'
import { faker } from '@faker-js/faker'
import Sibyl from '../../src/index'

export interface Order {
  id: number
  product: string
  currency: string
  price: string
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
const { createTable, Insert, All, Select, Create } = await Sibyl<Tables>(db)

createTable('orders', {
  currency: 'char',
  product: 'char',
  id: 'int',
  price: 'char',
})

const insertions: Order[] = []
for (let index = 0; index < 1000; index++) {
  insertions.push({
    id: faker.number.int(),
    product: faker.commerce.product(),
    currency: faker.finance.currency().name,
    price: faker.commerce.price(),
  })
}
Insert('orders', insertions)

export {
  All,
  Select,
  Insert,
  Create,
}
