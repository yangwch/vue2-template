<template>
  <div>
    <yt-list :title="options.title" search-field="playerName" :search-label="searchLabel" :search-api="searchApi" ref="list">
      <!--操作按鈕-->
      <template slot="buttons">
        <el-button type="default" @click="onCreate" v-if="options && options.add == true">{{$t('buttons.add')}}</el-button>
        <el-button type="default" @click="onEdit" v-if="options && options.edit == true">{{$t('buttons.edit')}}</el-button>
        <el-button type="danger" @click="onDel" v-if="options && options.delete == true">{{$t('buttons.delete')}}</el-button>
      </template>
      <!-- <template slot="search">
        <el-form :inline="true" :model="formInline" style="float:right" class="form-inline right">
          <el-form-item label="用户姓名">
            <el-input v-model="formInline.playerName" placeholder="用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="大于分数">
            <el-input-number v-model="formInline.minScore.value" :controls="false" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="小于分数">
            <el-input-number v-model="formInline.maxScore.value" :controls="false" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">{{$t('buttons.search')}}</el-button>
          </el-form-item>
        </el-form>
      </template> -->
      <!--数据列表 显示的列-->
      <template slot="columns">
        <el-table-column
         type="index"
         width="50">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in (options.columns || [])"
          :key="index"
          :property="item.field == 'id' ? 'id' : 'attributes.' + item.field"
          :width="item.width"
          :label="item.title"
          :align="item.align"
          :formatter="item.formatter || function (row, column, value) { return onFormatter(item.type, value, item) }"
        />
      </template>
    </yt-list>
    <!-- dialog -->
    <yt-dialog title="编辑表单" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="{
        playerName: {required: true, message: '必填'}
      }">
        <template v-for="(item, index) in (options.columns || [])">
          <el-form-item v-if="item.edit !== false" :label="item.title" :label-width="formLabelWidth" :key="index">
            <!-- 字符串，text/textarea -->
            <el-input
              v-if="!item.type || item.type === 'text' || item.type === 'textarea'"
              :type="item.type || 'text'"
              v-model="form[item.field]"
              clearable>
            </el-input>
            <!-- 数字 -->
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="form[item.field]"
              :min="item.min"
              :max="item.max"
              :controls="false"
              style="width: 100%">
            </el-input-number>
            <!-- 日期 -->
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="form[item.field]"
              type="date"
              placeholder="选择日期"
              style="width: 100%">
            </el-date-picker>
            <el-date-picker
              v-else-if="item.type === 'datetime'"
              v-model="form[item.field]"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
            <!-- radio -->
            <template v-else-if="item.type ==='radio'">
              <el-radio v-model="form[item.field]" v-for="(item, index) in item.options" :key="index" :label="item.value">{{item.text}}</el-radio>
            </template>
          </el-form-item>

        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </yt-dialog>
  </div>
  
</template>
<script>
  import { commonApi } from '@/api/index'
  export default {
    name: 'mmbsList',
    props: {
      options: {
        type: Object,
        default () {
          return {
            // 标题
            title: '表格',
            // 表名
            collectionName: 'GameList',
            // 添加功能
            add: true,
            // 修改功能
            edit: true,
            // 删除功能
            delete: true,
            // 显示列
            columns: []
          }
        }
      }
    },
    data () {
      return {
        formLabelWidth: '120px',
        formInline: {
          playerName: '',
          minScore: {
            type: 'greaterThan',
            field: 'score',
            value: 0
          },
          maxScore: {
            type: 'lessThan',
            field: 'score',
            value: 100
          }
        },
        form: { },
        objectId: '',
        dialogFormVisible: false,
        searchField: this.options.searchField || 'keyword',
        searchLabel: this.options.searchField || '关键字',
        searchApi: (collectionName => {
          return params => commonApi.get(collectionName, params)
        })(this.options.collectionName)
      }
    },
    methods: {
      /** 刷新 */
      onSearch () {
        this.$refs.list.onSearch()
      },
      /* 创建 */
      onCreate () {
        this.objectId = ''
        this.form = {
        }
        this.dialogFormVisible = true
      },
      // 列表格式化
      onFormatter (type, value, colItem) {
        if (type === 'date' || type === 'datetime') {
          return this.$fmtDateTime(value, colItem.format)
        }
        return value
      },
      onSubmit () {
        let api;
        if (this.objectId) {
          api = commonApi.update(this.options.collectionName, {id: this.objectId, data: this.form})
        } else {
          api = commonApi.save(this.options.collectionName, this.form)
        }
        api.then(result => {
          this.onSearch()
          this.dialogFormVisible = false
        }).catch(error => {
          this.dialogFormVisible = false
          this.$message.error(error)
        })
      },
      initEditForm (row) {
        for (let i = 0; i < this.options.columns.length; i++) {
          let column = this.options.columns[i]
          if (column.edit != false && (column.type === 'date' || column.type === 'datetime')) {
            this.form[column.field] = new Date(row.attributes[column.field]) // this.onFormatter(column.type, row.attributes[column.field], column)
          } else {
            this.form[column.field] = row.attributes[column.field]
          }
          //  this.form[column.field] = row.attributes[column.field]
        }
      },
      onEdit () {
        let row = this.$refs.list.getCurrentRow()
        if (row) {
          this.objectId = row.id
          this.initEditForm(row)
          this.dialogFormVisible = true
        }
      },
      onDel () {
        let row = this.$refs.list.getCurrentRow()
        if (row) {
          this.$confirm(`此操作将永久删除，是否继续？`, '提示').then(() => {
            commonApi.delete(this.options.collectionName, row.id).then((result) => {
              console.log(result)
              this.onSearch()
            }).catch(ex => {
              this.$message.error(ex)
            })
          }).catch(ex => {})
        }
      }
    }
  }
</script>
