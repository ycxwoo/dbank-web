import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  // console.log('env = ', env.VITE_APP_BASE_URL)
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
      // extensions: ['.js', '.json', '.ts', '.vue'] // 使用路径别名时想要省略的后缀名，可以自己 增减
    },
    base: './',
    server: {
      open: true, // 为 true 时自动在浏览器中打开应用程序
      // cors: true, // 允许跨域   开发服务器配置 CORS。默认启用并允许任何源
      strictPort: true, // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true
        },
        '/pub': {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true
        },
        '/admin': {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: 'dist', // 打包生成文件的名称
      assetsDir: 'assets', // 指定静态资源存放路径
      sourcemap: false // 是否构建要 source map 文件
    }
  }
})
