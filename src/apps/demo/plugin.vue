<template>
  <div style="margin: 20px;">
    <h1>mmbs List Component</h1>
    <mmbs-list :options="{
      title: '游戏列表',
      collectionName: 'GameList',
      add: true,
      edit: true,
      delete: true,
      columns: [
        {title: '名称', field: 'gameName', width: 150},
        {title: '公司名称', field: 'compony', width: 200},
        {title: '下载量', field: 'downloadNumber', type: 'number', width: 70, align: 'center'},
        {title: '发布时间', field: 'publishDate', type: 'date', width: 150, format: 'YYYY-MM-DD'},
        {title: '说明', field: 'remark', type: 'textarea'}
      ]
    }"/>
    <h1>mmbs query</h1>
    <mmbs-list-demo/>

    <h2>aggregate</h2>
    <aggregate/>

    <h1>i18n</h1>
    <i18n/>

    <h1>ytList</h1>
    <yt-list :title="title" :search-field="searchField" :search-label="searchLabel" :search-api="searchApi" :params="{dataId: 2}" ref="list">
      <!--操作按鈕-->
      <template slot="buttons">
        <el-badge value="button text from i18n">
          <el-button type="default">{{$t('buttons.add')}}</el-button>
          <el-button type="default" icon="iconfont icon-edit">{{$t('buttons.edit')}}</el-button>
          <el-button type="danger" icon="iconfont icon-delete">{{$t('buttons.delete')}}</el-button>
        </el-badge>
      </template>
      <template slot="search">
        <el-form :inline="true" :model="formInline" style="float:right" class="form-inline right">
          <el-form-item label="">
            <el-input v-model="formInline.user" placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!--数据列表 显示的列-->
      <template slot="columns">
        <!-- 多选列，需要多选时添加这列 -->
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          property="department"
          label="部门">
        </el-table-column>
        <el-table-column
          property="userName"
          label="用户姓名">
        </el-table-column>
      </template>
    </yt-list>
    <h1>treeGrid</h1>
    <yt-tree-grid
      slot
      :expanded="true"
      :items='[
          {
              "id": 101,"displayName": "综合集成与管控系统", "url": "", "icon": "el-icon-date",
              "children": [
                  { "id": 2, "displayName": "首页", "url": "/manage", "index": "manage", "icon": "iconfont icon-all" },
                  { "id": 12,"displayName": "结构监测系统", "url": "", "icon": "el-icon-document", "url": "/integratedControlSystem/structureMonitor" },
                  { "displayName": "数据管理3", "url": "", "icon": "el-icon-document",
                      "children":[
                          { "id": 15,"displayName": "用户登录记录","index": "test", "url": "/loginList" },
                          { "id": 16,"displayName": "用户列表","index": "test", "url": "/userList" }
                      ]
                  }
              ]
          }]'
      :columns='[{title: "菜单名称",key: "displayName",treeField: true,width: 250},{title: "URL",key: "url",width: 250}]'
      ref="treeGrid"></yt-tree-grid>
    <h1>ytDialog</h1>
    <div>
        拖动框示例：
        <el-button @click="dialogVisible=true">弹出模态框</el-button>
        <yt-dialog
          title="鼠标放到标题上可以拖动哦"
          :visible.sync="dialogVisible"
          size="tiny">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </yt-dialog>
    </div>
    <h1>ytPdf (集成pdfObject)</h1>
    <div style="height: 200px;width: 800px;margin: 0 auto;">
      <yt-pdf className="pdf-container" url="http://118.26.73.68:6062/static/img/sample-3pp.pdf">
      </yt-pdf>
    </div>
    
  </div>
</template>
<script>
import mmbsListDemo from './mmbsList'
import aggregate from './aggregate'
// i18n 例子
import i18n from './i18n'
export default {
  components: {
    mmbsListDemo,
    aggregate,
    i18n
  },
  data() {
    return {
      dialogVisible: false,
      formInline: {
        user: "",
        region: ""
      },
      searchField: "username",
      searchLabel: "输入用户名",
      title: "用户登录记录",
      searchApi: data => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              result: {
                total: 10,
                rows: [
                  {
                    id: 1,
                    userName: "张三",
                    department: "事业部"
                  },
                  {
                    id: 2,
                    userName: "张三",
                    department: "事业部"
                  },
                  {
                    id: 3,
                    userName: "张三",
                    department: "事业部"
                  },
                  {
                    id: 4,
                    userName: "张三",
                    department: "事业部"
                  },
                  {
                    id: 5,
                    userName: "张三",
                    department: "事业部"
                  }
                ]
              }
            })
          }, 2000)
        })
      }
    }
  },
  methods: {
    /** 刷新 */
    onSearch() {
      this.$refs.list.refresh(this.formInline)
    }
  }
}
</script>

<style lang="less" scoped>
  h1 {
    margin-left: 0.5em;
    border-bottom: 2px dotted #ccc;
    margin: 20px 0;
  }
  h2 {
    margin-left: 1em;
    line-height: 2.2em;
    text-decoration: underline;
    border-bottom-width: 50%;
  }
</style>
