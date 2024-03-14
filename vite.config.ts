import {defineConfig} from 'vite'

/**
 * 定义入口包
 */
export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'GloamHttp',
      fileName: 'gloamHttp'
    },
    rollupOptions:{
      external:['axios','crypto-js','dayjs','jsencrypt']
    }
  }
})
