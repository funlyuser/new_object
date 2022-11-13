const { defineConfig } = require('@vue/cli-service')
// const { config } = require('vue/types/umd')
module.exports = defineConfig({
  transpileDependencies: true
})




module.exports={
  chainWebpack:config=>{
    //打包阶段
    config.when(process.env.NODE_ENV==='production',(config)=>{
      config.entry('app').clear().add('./src/main-prod.js')
      //externals
     config.set('externals',{
                vue:'Vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                echarts:'echarts',
                nprogress:'nProgress',
                'vue-quill-editor':'VueQuillEditor'
            }),
            config.plugin('html').tap(arg=>{
              arg[0].isprod=true
              return arg
            })
    })
    //开发阶段
     config.when(process.env.NODE_ENV==='development',(config)=>{
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(arg=>{
              arg[0].isprod=false
              return arg
            })
    })
  }
}