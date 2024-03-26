import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['./src/sqljs/index.ts'],
  outdir: 'dist',
  plugins: [dts()],
})
