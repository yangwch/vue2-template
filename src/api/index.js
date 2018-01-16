import fetch from '@/config/fetch'
import mmbs from './mmbs'

/* 
 * 登录
*/
export const login = data => mmbs.login(data) // data => fetch('/mmbs/login', data)

// 用户列表
export const getUsers = () => mmbs.find('User')

// 分数表
export const getGameScore = data => mmbs.query('GameScore', data)
/* 保存 */
export const saveGameScore = data => mmbs.save('GameScore', data)
/* 更新记录 */
export const updateGameScore = data => mmbs.update('GameScore', data.id, data.data)
/* 删除记录 */
export const deleteGameScore = id => mmbs.delete('GameScore', id)
/* 统计 */
export const aggScore = () => mmbs.agg('GameScore', {group: {objectId: '$score'}})

/* 获取用户菜单 */
export const getUserMenus = () => fetch('/static/data/menus.json')

// 公共api,组件 增，删，改，查
export const commonApi = {
  get: (collectionName, data) => mmbs.query(collectionName, data),
  save: (collectionName, data) => mmbs.save(collectionName, data),
  update: (collectionName, data) => mmbs.update(collectionName, data.id, data.data),
  delete: (collectionName, data) => mmbs.delete(collectionName, data)
}