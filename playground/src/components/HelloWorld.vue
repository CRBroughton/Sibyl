<script setup lang="ts">
import { ref } from 'vue'
import Sibyl  from '../../../src/index'
import { QueryExecResult } from 'sql.js'
import sql from 'sql.js'
import { faker } from '@faker-js/faker'

interface tableRowType {
  id: number
  name: string
  sex: string
  job: string
}

interface secondRowType {
  id: number
}

interface Tables {
  firstTable: tableRowType
  secondTable: secondRowType
}

const SQL = await sql({
  locateFile: () => {
    return '/sql-wasm.wasm'
  }
})
const db = new SQL.Database()

const { createTable, Insert, Select, All, Create } = await Sibyl<Tables>(db)

const myResults = ref<QueryExecResult>()
const selection = ref<tableRowType[] | secondRowType[]>()

createTable('firstTable', {
  id: 'int',
  job: 'char',
  name: 'char',
  sex: 'char'
})

createTable('secondTable', {
  id: 'int',
})

let insertions: tableRowType[] = []
for (let index = 0; index < 1000; index++) {
  insertions.push({
    id: faker.number.int(),
    name: `${faker.person.firstName()}`,
    sex: `${faker.person.sex()}`,
    job: `${faker.person.jobTitle()}`,
  })
}
Insert('firstTable', insertions)

let sec: secondRowType[] = []
for (let index = 0; index < 1000; index++) {
  sec.push({
    id: faker.number.int(),
  })
}
Insert('secondTable', sec)

const results = db.exec('select * from firstTable')
const result = results[0]
myResults.value = result;


const resultsTest = All('secondTable')
selection.value = Select('firstTable', {
  where: {
    id: 1,
  },
  limit: 20,
})

function submitEntry() {
  const result = Create('firstTable', {
      id: faker.number.int(),
      name: 'Craig',
      sex: 'male',
      job: 'Software Engineer',
  })
console.log(result)
}
</script>

<template>
  <button @click="submitEntry">
    Submit
  </button>
  <div>
    {{ selection }}
  </div>
  <div class="table">
    <div class="table-row">
      <div class="table-cell font-bold pr-2" v-for="column, columnIndex in resultsTest?.columns" :key="columnIndex">
        {{ column }}
      </div>
    </div>

    <div class="table-row" v-for="row, rowIndex in myResults?.values" :key="rowIndex">
      <div class="table-cell" v-for="_value, columnIndex in myResults?.columns" :key="columnIndex">
        {{ row[columnIndex] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.table {
  display: table;
}

.table-row {
  display: table-row;
}

.table-cell {
  display: table-cell;
}

.font-bold {
  font-weight: 700;
}

.pr-2 {
  padding-right: 0.5rem;
}
</style>
