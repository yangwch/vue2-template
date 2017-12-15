import dtime from 'time-formater'

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}
 
/**
 * 获取localStorage
 * @param {String} type 返回类型,默认返回string
 */
export const getStore = (name, type) => {
  if (!name) { return; }
  var content = window.localStorage.getItem(name)
  if (type && (type.toLowerCase() == 'object' || type.toLowerCase() == 'array')) {
    try {
      content = content && JSON.parse(content)
    } catch (ex) { }
  }
  return content;
}

/**
 * 获取用户信息，返回一个对象
 */
export const getUserinfo = () => {
  return { 'Userinfo': window.localStorage.getItem('userInfo') }
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) { return; }
  window.localStorage.removeItem(name);
}

var permissions = {}
/* 判断是否有权限 */
export const hasPermission = name => {
  return permissions[name] == true
}

/* 设置权限名 */
export const setPermissions = permissionNames => {
  permissions = {}
  for (let k in permissionNames) {
    permissions[permissionNames[k]] = true
  }
}
/* 格式化日期 */
/* 格式化日期 */
export const fmtDateTime = (date, format) => {
  if (date) {
    return dtime(date).format(format || 'YYYY-MM-DD HH:mm:ss')
  }
  return null;
}

var jsArray = {};
/* 加载脚本 */
export const loadScript = window.loadScript = (scriptName, callback) => {
  var scriptSrc, callFun;
  if ((typeof scriptName === typeof []) && scriptName.length) {
    if (scriptName.length == 1) {
      scriptSrc = scriptName[0];
    } else {
      scriptSrc = scriptName.shift();
      callFun = function () {
        loadScript(scriptName, callback);
      }
    }
  }
  if (scriptSrc && !jsArray[scriptSrc]) {
    jsArray[scriptSrc] = true;
    // adding the script tag to the head as suggested before
    var body = document.getElementsByTagName('body')[0],
      script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc || scriptName;
    
    script.onload = callFun || callback;
    body.appendChild(script);
  } else {
    if (callFun) {
      callFun();
    } else {
      callback();
    }
  }
};
