/*
 * 注册全局组件，过滤器，方法。。。
*/

import ytTable from './table/table'
import ytList from './listTemp/list'
import ytTreeGrid from './treegrid/treegrid'
import ytSubmenu from './menu/submenu'
import ytMenu from './menu/index'
import ytMap from './map/map'
import ytDialog from './dialog/dialog'
import ytCombotree from './combotree/index'
/* 编辑器 */
import { quillEditor } from 'vue-quill-editor'
/* pdf */
import ytPdf from './pdf/pdf'
/* echarts */
import ytEcharts from './echarts/echarts'
/* 扩展方法 */
import * as mUtils from '@/config/mUtils'

var plugin = {
  ytTreeGrid: ytTreeGrid,
  ytTable: ytTable,
  ytList: ytList,
  quillEditor: quillEditor,
  ytPdf: ytPdf,
  ytSubmenu: ytSubmenu,
  ytMenu: ytMenu,
  ytMap: ytMap,
  ytDialog,
  ytEcharts,
  ytCombotree: ytCombotree
}
export default {
  install (Vue) {
    for (var k in plugin) {
      Vue.component(k, plugin[k])
    }

    /* 列表格式转换成树格式
     * @param data 数组
     * @param parentId 父节点id
     * @param pidField 父节点字段名
     */
    const converToTreedata = (data, parentId, pidField) => {
      var list = []
      data.forEach((item) => {
        if (item[pidField] == parentId) {
          item.children = converToTreedata(data, item.id, pidField)
          list.push(item)
        }
      })
      return list
    }
    Vue.prototype.$converToTreedata = converToTreedata
    /* 扩展方法 */
    for (let prop in mUtils) {
      Vue.prototype['$' + prop] = mUtils[prop]
    }
  }
}
