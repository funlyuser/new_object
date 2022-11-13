const propplugin=[]
if(process.env.NODE_ENV==='production'){
  propplugin.push('transform-remove-console')
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...propplugin,
    '@babel/plugin-syntax-dynamic-import'
  ]
}