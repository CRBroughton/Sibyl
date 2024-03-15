<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { All, Order, Select as SelectOrders, Create } from '@/sibyl'
import { computed, onMounted, ref } from 'vue'
import { faker } from '@faker-js/faker'
import type { SibylResponse } from '@crbroughton/sibyl'

const results = ref<SibylResponse<Order>[] | undefined>([])
const currencies = ref<string[]>([])
const selectedCurrency = ref('')
onMounted(() => {
  results.value = All('orders')
  function getCurrencies(orders: SibylResponse<Order>[]): string[] {
  currencies.value.push('All')

  orders.forEach(order => {
    if (!currencies.value.includes(order.currency)) {
      currencies.value.push(order.currency)
    }
  })

  return currencies.value
}
if (results.value !== undefined) {
  getCurrencies(results.value)
}
})

function filterOrders() {
  if (selectedCurrency.value !== 'All') {
    results.value = SelectOrders('orders', {
    where: {
      currency: selectedCurrency.value
    }
  })
  } else {
    results.value = All('orders')
  }
}

const tableClasses = computed(() => {
  if (results.value!.length <= 15)
    return ''

  if (results.value!.length === 1)
    return ''

  if (results.value!.length > 0)
    return 'block overflow-scroll h-96 min-h-96'
  return ''
})

function createNewEntry() {
  Create('orders', {
    id: faker.number.int(),
    product: faker.commerce.product(),
    currency: faker.finance.currency().name,
    price: faker.commerce.price(),
    booleanTest: false,
  })
  results.value = All('orders')
}

const amountOfOrders = computed(() => {
  return results.value && results.value.length
})
</script>

<template>
  <div v-if="results" class="my-6 lg:w-[980px]">
    <Card class="w-full lg:w-[980px]">
      <CardHeader>
        <CardTitle>
            Sybil Table
        </CardTitle>
        <CardDescription>
          Order amount: {{ amountOfOrders }}
        </CardDescription>
        <div class="my-2">
          <Select v-model="selectedCurrency">
            <SelectTrigger>
                <SelectValue placeholder="Currency Filter" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
              <SelectLabel>Currencies</SelectLabel>
                <div v-for="c in currencies">
                  <SelectItem :value="c" @click="filterOrders">
                    {{ c }}
                  </SelectItem>
                </div>
            </SelectGroup>
            </SelectContent>
        </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table class="mb-6" :class="tableClasses">
          <TableHeader>
            <TableRow>
              <TableHead class="w-[25%]">
                ID
              </TableHead>
              <TableHead class="w-[25%]">
                Currency
              </TableHead>
              <TableHead class="w-[25%]">
                Product
              </TableHead>
              <TableHead class="w-[25%]">
                Price
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in results" :key="row.id">
              <TableCell class="font-medium">
                {{ row.id }}
              </TableCell>
              <TableCell>
                {{ row.currency }}
              </TableCell>
              <TableCell>{{ row.product }}</TableCell>
              <TableCell>{{ row.price }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div>
          <Button @click="createNewEntry">
            Create New Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>