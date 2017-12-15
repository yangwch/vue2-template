import fetch from '@/config/fetch'

/* 
 * 登录
*/
export const login = data => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve({
      success: true,
      result: {
        userInfo: {
          userName: 'admin',
          displayName: '管理员'
        }
      }
    }), 2000);
  });
}
/* 获取用户菜单 */
export const getUserMenus = () => fetch('/static/data/menus.json');