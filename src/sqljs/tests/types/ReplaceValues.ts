/* eslint-disable unused-imports/no-unused-vars */
import type { Equals, Expect } from '@crbroughton/ts-test-utils'
import type { ReplaceValues } from '../../../types'

interface Replacing {
  id: 1
  name: 'Craig'
}

interface Replaced {
  id: number
  name: string
}

type Actual = ReplaceValues<Replaced, Replacing>
interface Expectation {
  id: 1
  name: 'Craig'
}
type ReplaceValuesResult = Expect<Equals<Actual, Expectation>>
//   ^?
