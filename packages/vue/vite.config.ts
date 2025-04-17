import type { UserConfig, UserConfigExport } from 'vite'
import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const config: UserConfig = {
  plugins: [Vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ts-inputs-vue',
      fileName: 'index',
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['vue', 'ts-inputs'],
      output: {
        format: 'es',
        exports: 'named',
        globals: {
          'vue': 'Vue',
          'ts-inputs': 'TsInputs',
        },
      },
    },
  },
}

const viteConfig: UserConfigExport = defineConfig(config)
export default viteConfig
