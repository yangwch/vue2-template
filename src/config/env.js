/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: api域名地址
 * routerMode: 路由模式
 * appId: 应用名
 * mmbsURL: mmbs服务地址
 * defPageSize: 默认分页数
 * locale: 默认语言
 * 
 */
// baseUrl: api域名地址
let baseUrl = ''
// routerMode: 路由模式
let routerMode = 'hash'
// appId: 应用名
let appId = 'YTAPP'
// mmbsURL: mmbs服务地址
let mmbsURL = 'http://localhost:3080/mmbs'
// masterKey
// let masterKey = '123456'
// defPageSize: 默认分页数
let defPageSize = 10
// 默认语言
let locale = 'cn'

if (process.env.NODE_ENV == 'development') {
  baseUrl = '';
}

export {
  baseUrl,
  routerMode,
  appId,
  mmbsURL,
  masterKey,
  defPageSize,
  locale
}
