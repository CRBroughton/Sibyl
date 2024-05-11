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

import { All, Order, Select as SelectOrders, Create, Update } from '@/sibyl'
import { computed, onMounted, ref } from 'vue'
import { faker } from '@faker-js/faker'
import { useVirtualList } from '@vueuse/core'
import type { SibylResponse } from '@crbroughton/sibyl'

const results = ref<SibylResponse<Order>[]>([])
const { list, wrapperProps, containerProps, scrollTo } = useVirtualList(results, {
  itemHeight: 53,
})

const currencies = ref<string[]>([])
const selectedCurrency = ref('')
onMounted(() => {
  const response = All('orders')

  if (response !== undefined) {
    results.value = response
  }

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
    const response = SelectOrders('orders', {
      where: {
        currency: selectedCurrency.value
      }
    })
    if (response !== undefined) {
      results.value = response
    }
  } else {
    const response = All('orders')
    if (response !== undefined) {
      results.value = response
    }
  }
  scrollTo(0)
}

const selectedStatus = ref<'all' | 'processing' | 'completed' | 'failed'>()
function filterStatus() {
  if (selectedStatus.value !== 'all') {
    const response = SelectOrders('orders', {
      where: {
        status: selectedStatus.value
      }
    })
    if (response !== undefined) {
      results.value = response
    }
  } else {
    const response = All('orders')
    if (response !== undefined) {
      results.value = response
    }
  }
  scrollTo(0)
}

function updateAllProcessingAndFailedOrders() {
  const response = SelectOrders('orders', {
    where: {
      OR: [
        {
          status: 'processing'
        },
        {
          status: 'failed'
        }
      ]
    }
  })

  if (response !== undefined) {
    response.forEach(order => {
      Update('orders', {
        where: {
          id: order.id,
        },
        updates: {
          status: 'completed'
        }
      })
    })
  }
  const newResults = All('orders')
  if (newResults !== undefined) {
    results.value = newResults
  }
}

// const tableClasses = computed(() => {
//   if (results.value!.length <= 15)
//     return ''

//   if (results.value!.length === 1)
//     return ''

//   if (results.value!.length > 0)
//     return 'block overflow-scroll h-96 min-h-96'
//   return ''
// })

function createNewEntry() {
  Create('orders', {
    id: faker.number.int(),
    product: faker.commerce.product(),
    currency: faker.finance.currency().name,
    price: faker.commerce.price(),
    booleanTest: false,
    status: 'completed'
  })
  const response = All('orders')
  if (response !== undefined) {
    results.value = response
  }
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
          Sibyl Table
        </CardTitle>
        <CardDescription>
          Order amount: {{ amountOfOrders }}
        </CardDescription>
        <div class="flex my-2 gap-2">
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
          <Select v-model="selectedStatus">
            <SelectTrigger>
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <div v-for="status in ['all', 'processing', 'completed', 'failed']">
                  <SelectItem :value="status" @click="filterStatus">
                    {{ status }}
                  </SelectItem>
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div v-bind="containerProps" class="h-[380px]">
          <Table v-bind="wrapperProps" class="mb-6 h-[380px]">
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
                <TableHead class="w-[25%]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in list" :key="row.index">
                <TableCell class="font-medium">
                  {{ row.data.id }}
                </TableCell>
                <TableCell>
                  {{ row.data.currency }}
                </TableCell>
                <TableCell>{{ row.data.product }}</TableCell>
                <TableCell>{{ row.data.price }}</TableCell>
                <TableCell>{{ row.data.status }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div class="flex gap-2">
          <Button @click="createNewEntry">
            Create New Entry
          </Button>
          <Button @click=updateAllProcessingAndFailedOrders>
            Update Failed and Processing Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>