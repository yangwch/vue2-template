# vue2-tempalte

此项目是 vue + element-ui@2.+ 构建的后台管理系统
使用了更为严格的es-lint，同样忽略了一部分规则

## 技术栈

vue2 + vuex + vue-router +vue-i18n + webpack + ES6/7 + less + element-ui


## 项目运行


``` bash
# 1.安装nodejs

# 2.配置npm源为淘宝镜像
npm config set registry https://registry.npm.taobao.org

# 3.安装依赖
npm install

# 4.运行开发环境
npm run dev

# 5.发布(到dist)
npm run build

# 6.带分析报告的发布
npm run build --report

访问: http://localhost:8080 （端口在文件 config/index.js 中 dev 段 port)
示例：http://localhost:8080/#/demo

```

## 项目目录

```
--vue2-template
 --src      源码目前
   --api    webapi请求
   --apps   页面
    --components 应用级组件
    --views 路由页面
    --demo  测试页面
   --config 配置及通用脚本
   --router 路由配置
   --store  vuex
   --style  样式文件
   
 --static   静态资源
    --data  json文件
 --dist     编译目录，可直接部署在iis/nginx
 --build    运行环境脚本及编译脚本
 --config   运行配置
 --test     单元测试
 ```
 
 ## webapi格式
 接口返回json格式
 ```
   {
    "result": {
        "total": 10,
        "rows": [{id: 11,name: 'aa'}]
    },
    "success": true,
    "error": null
   }
 ```
 
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
