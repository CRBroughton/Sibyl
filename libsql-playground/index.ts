import Sibyl from '@crbroughton/sibyl_libsql'
import Database from 'libsql'

const db = new Database(':memory:')

// Create table schema
interface Tables {
  firstTable: {
    id: number
    name: string
    location: string
    hasReadTheReadme: boolean
  }
}
const { createTable, Insert, Select, All } = await Sibyl<Tables>(db)

createTable('firstTable', {
  id: {
    autoincrement: true,
    type: 'INTEGER',
    primary: true,
    unique: true,
  },
  name: {
    type: 'char',
  },
  hasReadTheReadme: {
    type: 'bool',
  },
  location: {
    type: 'char',
  },
})

Insert('firstTable', [
  {
    id: 1,
    hasReadTheReadme: true,
    location: 'Brighton',
    name: 'Craig',
  },
  {
    id: 2,
    hasReadTheReadme: false,
    location: 'Leeds',
    name: 'Bob',
  },
  {
    id: 3,
    hasReadTheReadme: true,
    location: 'Brighton',
    name: 'David',
  },
])

const allResponse = All('firstTable')
console.log(allResponse)

const selectedResponse = Select('firstTable', {
  where: {
    id: 1,
  },
})
console.log(selectedResponse)

const selectedResponseWithMultiple = Select('firstTable', {
  where: {
    id: 1,
    location: 'Brighton',
  },
})
console.log(selectedResponseWithMultiple)

const selectedREsponseWithORStatement = Select('firstTable', {
  where: {
    OR: [
      {
        name: 'Craig',
      },
      {
        hasReadTheReadme: 1,
      },
    ],
  },
})
console.log('here', selectedREsponseWithORStatement)
