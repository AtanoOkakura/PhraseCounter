import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['ts/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: 'js'
})