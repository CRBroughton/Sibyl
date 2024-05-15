/* eslint-disable node/prefer-global/process */
import { createClient } from '@libsql/client'
import Sibyl from '@crbroughton/sibyl_bun'

const client = createClient({
  url: process.env.TURSO_DB_URL!,
  authToken: process.env.TURSO_DB_AUTH_TOKEN!,
})

const {} = Sibyl(client)
