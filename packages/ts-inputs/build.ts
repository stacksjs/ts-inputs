import { dts } from 'bun-plugin-dtsx'

await Bun.$`rm -rf dist`

await Bun.build({
  target: 'browser',
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  plugins: [dts()],
})
