<template>
  <div>
    <yt-list :title="title" search-field="playerName" :search-label="searchLabel" :search-api="searchApi" :search-params="formInline" ref="list">
      <!--操作按鈕-->
      <template slot="buttons">
        <el-button type="default" @click="onCreate">创建</el-button>
        <el-button type="default" @click="onEdit">修改</el-button>
        <el-button type="danger" @click="onDel">删除</el-button>
      </template>
     <template slot="search">
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
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!--数据列表 显示的列-->
      <template slot="columns">
        <el-table-column
         type="index"
         width="50">
        </el-table-column>
        <el-table-column
         property="id"
         width="150"
         label="ID">
        </el-table-column>
        <el-table-column
         sortable
         property="attributes.playerName"
         label="用户姓名">
        </el-table-column>
        <el-table-column
         sortable
         property="attributes.score"
         label="分数">
        </el-table-column>
      </template>
    </yt-list>
    <!-- dialog -->
    <yt-dialog title="编辑表单" :visible.sync="dialogFormVisible" size="tiny">
      <el-form :model="form" :rules="{
        playerName: {required: true, message: '必填'}
      }">
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="form.playerName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分数" :label-width="formLabelWidth">
          <el-input-number v-model="form.score" controls-position="right" :min="0" :max="100"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </yt-dialog>
  </div>
  
</template>
<script>
  import { getGameScore, saveGameScore, updateGameScore, deleteGameScore } from '@/api/index'
  export default {
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
        form: {
          playerName: '',
          score: 0
        },
        objectId: '',
        dialogFormVisible: false,
        searchField: 'username',
        searchLabel: '输入用户名',
        title: '用户登录记录',
        searchApi: getGameScore
      }
    },
    methods: {
      /** 刷新 */
      onSearch () {
        this.$refs.list.onSearch(this.formInline)
      },
      /* 创建 */
      onCreate () {
        this.objectId = ''
        this.form = {
          playerName: '',
          score: 0
        }
        this.dialogFormVisible = true
      },
      onSubmit () {
        let api;
        if (this.objectId) {
          api = updateGameScore({id: this.objectId, data: this.form})
        } else {
          api = saveGameScore(this.form)
        }
        api.then(result => {
          this.onSearch()
          this.dialogFormVisible = false
        }).catch(error => {
          this.dialogFormVisible = false
          this.$message.error(error)
        })
      },
      onEdit () {
        let row = this.$refs.list.getSelection()
        if (row) {
          this.objectId = row.id
          this.form = Object.assign({}, row.attributes)
          this.dialogFormVisible = true
        }
      },
      onDel () {
        let row = this.$refs.list.getSelection()
        if (row) {
          this.$confirm(`此操作将永久删除 ${row.attributes.playerName}，是否继续？`, '提示').then(() => {
            deleteGameScore(row.id).then((result) => {
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