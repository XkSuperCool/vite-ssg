import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/node/cli.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  splitting: true,
  dts: true,
  bundle: true,
  clean: true,
  shims: true
})