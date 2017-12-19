<template>
  <div style="margin: 20px;">
    <h1>i18n</h1>
    <!-- 多语言 -->
    <el-radio-group v-model="locale" @change="onLocaleChange">
      <el-radio-button :label="item.value" v-for="(item,index) in langs" :key="index">{{item.text}}</el-radio-button>
    </el-radio-group>
    <pre>
      const messagess = {
        cn: {
          messages: {
            hello: '你好，世界！ %{msg}',
            apple: '没有苹果 | 一个苹果 | {count} 个'
          }
        },
        en: {
          messages: {
            hello: 'hello world %{msg}',
            apple: 'no apples | one apple | {count} apples'
          }
        }
      }
    </pre>
    <h2>basic</h2>
    <pre>
    $t('messages.hello', {msg: 'test msg 000'})
    </pre>
    output:<br/><br/>
    <p>
      {{$t('messages.hello', {msg: 'test msg 000'})}}
    </p>

    <h2>多元化 Pluralization</h2>
    <pre>
      $tc('messages.apple', 0)
      $tc('messages.apple', 1)
      $tc('messages.apple', 10 , {count: 10})
    </pre>
    output:
    <ol>
      <li>* {{$tc('messages.apple', 0)}}</li>
      <li>* {{$tc('messages.apple', 1)}}</li>
      <li>* {{$tc('messages.apple', 10 , {count: 10})}}</li>
    </ol>

    <h2>货币</h2>
    output:
    <pre>
      $n(100, 'currency', 'zh-CN')
      $n(100, 'currency', 'en-US')
      $n(100, 'currency', 'euro')
    </pre>
    <ol>
      <li>人民币：{{$n(100, 'currency', 'zh-CN')}}</li>
      <li>美元：{{$n(100, 'currency', 'en-US')}}</li>
      <li>欧元：{{$n(100, 'currency', 'euro')}}</li>
    </ol>


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
export default {
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
      locale: this.$store && this.$store.state.locale,
      langs: [
        {value: 'cn', text: '中文'},
        {value: 'en', text: 'English'}
      ],
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
            });
          }, 2000);
        });
      }
    };
  },
  methods: {
    /** 刷新 */
    onSearch() {
      this.$refs.list.refresh(this.formInline);
    },
    /* 语言选择变化 */
    onLocaleChange(value) {
      this._i18n.locale = value;
      this.$store.commit('saveLocale', value);
    }
  }
};
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
  pre {
    border: 1px dotted #ccc;
    padding-top: 15px;
  }
</style>
