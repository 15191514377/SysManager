const {
  defineConfig
} = require('@vue/cli-service')
const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map', // 配置本地调试
    module: {},
    experiments: {
      topLevelAwait: true,
    },
    resolve: {
      alias: {
          // 设置@/的意义
          '@': resolve('src')
      }
  }
  }
})