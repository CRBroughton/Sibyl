<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import DemoTable from './components/DemoTable.vue'
import { Button } from '@/components/ui/button'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky z-40 top-0 backdrop-blur-lg border-b border-border">
      <div class="container flex h-14 max-w-screen-2xl items-center">
        <div class="flex gap-5 items-center">
          <p class="font-bold">
            Sibyl Playground
          </p>
          <Button variant="link" class="font-bold">
            <a href="https://github.com/crbroughton/sibyl">Github</a>
          </Button>
        </div>
        <div class="ml-auto flex gap-5">
          <Button @click="toggleDark()">
            Toggle {{ isDark ? 'Dark' : 'Light' }} Mode
          </Button>
        </div>
      </div>
    </header>
    <div class="container">
      <Suspense>
        <DemoTable />
      </Suspense>
    </div>
  </div>
</template>
