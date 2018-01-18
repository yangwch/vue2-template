/**
 * 配置管理系统路由
 */
const menu = r => require.ensure([], () => r(require('@/apps/views/config/menu')), 'menu')
const role = r => require.ensure([], () => r(require('@/apps/views/config/role')), 'role')
const user = r => require.ensure([], () => r(require('@/apps/views/config/user')), 'user')

export default [
  {
    path: '/config/menu',
    name: 'menu',
    component: menu,
    meta: ['系统配置', '菜单管理']
  },
  {
    path: '/config/role',
    name: 'role',
    component: role,
    meta: ['系统配置', '角色管理']
  },
  {
    path: '/config/user',
    name: 'user',
    component: user,
    meta: ['系统配置', '账户管理']
  },
]