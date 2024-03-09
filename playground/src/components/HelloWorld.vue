<script setup lang="ts">
import { ref } from 'vue'
import { Sibyl } from '../../../src/index'
import { QueryExecResult } from 'sql.js'
import { faker } from '@faker-js/faker'

interface tableRowType {
    id: number
    name: string
    sex: string
    job: string
}
const { db, createTable, Insert, Select, All } = await Sibyl<tableRowType>('test', '/sql-wasm.wasm')

const myResults = ref<QueryExecResult>()
const selection = ref<tableRowType[]>()

  createTable('id int, name char, sex char, job char')

  let insertions: tableRowType[] = []
    for (let index = 0; index < 1000; index++) {
      insertions = [...insertions, 
      {
      id: faker.number.int(),
      name: `${faker.person.firstName()}`,
      sex: `${faker.person.sex()}`,
      job: `${faker.person.jobTitle()}`,
    },
    ]
  }
  const test = Insert('test', insertions)
  db.run(test)
  
  const results = db.exec('select * from test')
  const result = results[0]
  myResults.value = result

  
const resultsTest = All()
selection.value = Select({
   where: {
    sex: 'male',
   },
   limit: 20,
})
</script>

<template>
    <div>
      {{ selection }}
  </div>
<div class="table">
  <div class="table-row">
    <div 
      class="table-cell font-bold pr-2"
      v-for="column, columnIndex in resultsTest?.columns"
      :key="columnIndex">
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
