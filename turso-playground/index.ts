/* eslint-disable node/prefer-global/process */
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DB_URL!,
  authToken: process.env.TURSO_DB_AUTH_TOKEN!,
})
