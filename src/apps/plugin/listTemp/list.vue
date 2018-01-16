<!-- 
  列表页面模板插件 2017-06-28
  @author yangwenchao
 -->
<template>
  <el-card class="box-card table_container">
    <!--标题-->
    <slot name="header">
      <div slot="header" class="clearfix" v-text="title">
      </div>
    </slot>
    <el-row>
      <el-col :span="8">
        <slot name="buttons">&nbsp;</slot>
      </el-col>
      <slot name="search">
        <!--右边的搜索-->
        <el-col :span="16">
          <el-form :inline="true" :model="formData" class="form-inline right">
              <el-form-item label="">
              <el-input v-model="formData.search" @keyup.enter.native="onSearch" :placeholder="searchLabel"></el-input>
              </el-form-item>
             <el-form-item>
              <el-button type="primary" @click="onSearch">{{$t("buttons.search")}}</el-button>
              </el-form-item>
          </el-form>
        </el-col>
      </slot>
    </el-row>
    <!--新增无命名的组件，用于巡检任务页面图片的排列-->
    <slot></slot>
    <slot name="tabs"></slot>
    <!--分页-->
    <yt-table ref="tablePl"
      :fit="fit"
      :params= "searchParams"
      :stripe="stripe"
      :pagination="pagination"
      :page-sizes="pageSizes"
      :search-api="searchApi">
            <template slot="columns">
                <slot name="columns">
                </slot>
            </template>
        </yt-table>
  </el-card>
</template>

<style lang="less">
.table_container{
  margin: 10px;
}
</style>
<script>
  export default {
    props: {
      /* 列宽是否自撑开 */ 
      fit: {
        type: Boolean,
        default: true,
        required: false
      },
      /* 是否显示斑马纹 */ 
      stripe: {
        type: Boolean,
        default: true,
        required: false
      }, 
      /* 查询字段名 */ 
      searchField: {
        type: String,
        default: 'name',
        required: false
      },
      /* 查询字段显示名 */ 
      searchLabel: {
        type: String,
        default: '关键字'
      },
      /* 是否分页，默认分页 */ 
      pagination: {
        type: Boolean,
        default: true,
        required: false
      },
      /* 分页数量选项 */ 
      pageSizes: {
        type: Array,
        default: function () {
          return [5, 10, 15, 50, 100];
        },
        required: false
      },
      /* 页面标题 */ 
      title: {
        type: String,
        default: '列表',
        required: false
      },
      /* 查询Api,方法 */ 
      searchApi: {
        type: Function,
        required: true
      },
      /* 查询参数 */ 
      params: {
        type: Object,
        default () {
          return {};
        },
        required: false
      }
    },
    /* 数据 */ 
    data () {
      return {
        formData: {
          search: ''
        }
      }
    },
    computed: {
      searchParams: function () {
        var params = Object.assign({}, this.params)
        params[this.searchField] = this.formData.search;
        return params;
      }
    },
    components: {
      
    },
    created () {

    },
    methods: {
      /* 获取选中 */ 
      getSelection () {
        return this.$refs.tablePl.getSelection()
      },
      // 获取当前行
      getCurrentRow () {
        return this.$refs.tablePl.getCurrentRow()
      },
      /* 返回表格当前的数据 */ 
      getTableData () {
        return this.$refs.tablePl.getTableData()
      },
      /* 查询 */ 
      onSearch (params) {
        var tmpParams = this.searchParams
        if (params) {
          tmpParams = Object.assign({}, this.params, params)
        } else {
          tmpParams = Object.assign({}, this.params, tmpParams)
        }
        this.$refs.tablePl.search(tmpParams)
      },
      /* 取消选中 */ 
      clearSelection () {
        this.$refs.tablePl.clearSelection()
      }
    },
  }
</script>

