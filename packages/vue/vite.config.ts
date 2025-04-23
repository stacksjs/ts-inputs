import type { UserConfig, UserConfigFnObject } from 'vite'
import { resolve } from 'node:path'

import Vue from '@vitejs/plugin-vue'
import CleanCSS from 'clean-css'
import UnoCSS from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

function minify(code: string) {
  const cleanCssInstance = new CleanCSS({})
  return cleanCssInstance.minify(code).styles
}

const config: UserConfigFnObject = defineConfig(({ mode }): UserConfig => {
  const cssFiles: string[] = []
  const userConfig: UserConfig = {}

  const commonPlugins = [
    Vue({
      include: /\.(stx|vue|md)($|\?)/,
    }),
  ]

  if (mode === 'lib') {
    userConfig.build = {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ts-inputs',
        fileName: 'index',
      },
      outDir: 'dist',
      emptyOutDir: true,
      cssCodeSplit: false,
      sourcemap: true,
      rollupOptions: {
        external: ['vue'],
        output: [
          {
            format: 'es',
            entryFileNames: `index.js`,
            preserveModules: false,
          },
        ],
      },
    }
    userConfig.plugins = [
      ...commonPlugins,
      {
        name: 'inline-css',
        transform(code, id) {
          const isCSS = (path: string) => /\.css$/.test(path)
          if (!isCSS(id))
            return

          const cssCode = minify(code)
          cssFiles.push(cssCode)

          return {
            code: '',
            map: { mappings: '' },
          }
        },
        renderChunk(code, { isEntry }) {
          if (!isEntry)
            return

          const combinedCSS = cssFiles.join('')
          return {
            code: `\
            function __insertCSSTSInputs(code) {
              if (!code || typeof document == 'undefined') return
              let head = document.head || document.getElementsByTagName('head')[0]
              let style = document.createElement('style')
              style.type = 'text/css'
              head.appendChild(style)
              ;style.styleSheet ? (style.styleSheet.cssText = code) : style.appendChild(document.createTextNode(code))
            }\n
            __insertCSSTSInputs(${JSON.stringify(combinedCSS)})
            \n ${code}`,
            map: { mappings: '' },
          }
        },
      },
    ]
  }

  return {
    plugins: [...commonPlugins],
    ...userConfig,
  }
})

export default config
