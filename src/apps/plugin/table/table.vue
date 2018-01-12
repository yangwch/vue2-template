<!--
  表格组件，支持分页
-->
<template>
  <div>
    <el-table
      ref="table"
      border
      :fit="fit"
      :stripe="stripe"
      :data="tableData"
      :empty-text="emptyText"
      highlight-current-row
      @sort-change="onSortChange"
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange">
      <slot name="columns"/>
    </el-table>
    <div
      v-if="pagination"
      class="Pagination"
      style="text-align: left;margin-top: 10px;">
      <el-pagination
        v-if="reload"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="limit"
        layout="total, -> ,sizes, -> , prev, pager, next"
        :total="count"
      />
    </div>
  </div>
</template>
<style lang="less">
  .el-table__body tr.current-row>td, .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
      background: #d6e0e8;
  }
</style>
<script>
  import {defPageSize} from '@/config/env'
  export default {
    props: {
      /*  列宽是否自撑开 */ 
      fit: {
        type: Boolean,
        default: true,
        required: false
      },
      /*  是否显示斑马纹 */ 
      stripe: {
        type: Boolean,
        default: true,
        required: false
      },
      /*  是否分页，默认分页 */ 
      pagination: {
        type: Boolean,
        default: true,
        required: false
      },
      /*  分页数量选项 */ 
      pageSizes: {
        type: Array,
        default: function () {
          return [5, 10, 15, 50, 100];
        },
        required: false
      },
      /*  查询Api,方法 */ 
      searchApi: {
        type: Function,
        required: true
      },
      /*  查询参数 */ 
      params: {
        type: Object,
        default () {
          return {};
        },
        required: false
      }
    },
    /*  数据 */ 
    data () {
      return {
        reload: true,
        tableData: [],
        currentRow: null,
        offset: 0,
        limit: defPageSize,
        count: 0,
        currentPage: 1,
        emptyText: '暂无数据',
        selection: null,
        orderOption: null
      }
    },
    components: {
    },
    created () {
      this.initData();
    },
    methods: {
      async initData () {
        try {
          this.getApiData();
        } catch (err) {
          this.$message.error('获取数据失败');
        }
      },
      /*  页码数量变化 */ 
      handleSizeChange(val) {
        this.limit = val
        this.getApiData()
      },
      /*  当前页变化事件 */ 
      handleCurrentChange(val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limit
        this.getApiData()
      },
      /*  行选中事件 */ 
      onCurrentChange(selection) {
        this.currentRow = selection
      },
      /*  当选择项变化时触发 */ 
      onSelectionChange(selection) {
        this.selection = selection
      },
      /* 获取选中 */ 
      getSelection() {
        return this.selection
      },
      /* 获取当前行 */
      getCurrentRow() {
        return this.currentRow
      },
      /*  返回当前表格装载数据 */ 
      getTableData() {
        return this.tableData;
      },
      /*  获取数据 */ 
      async getApiData() {
        var params = {} // this.params
        params.page = this.currentPage
        params.rows = this.limit
        params.params = this.params
        params._order = this.orderOption
        this.emptyText = '加载中。。。',
        this.tableData = [],
        this.reload = false
        const result = await this.searchApi(params)
        this.tableData = (result && result.result && result.result.rows) || []
        this.count = (result && result.result && result.result.total) || 0
        this.emptyText = '暂无数据'
        this.reload = true
      },
      /*  查询 */ 
      search (params) {
        /*  参数 */ 
        for (var i in params) {
          this.params[i] = params[i];
        }
        this.getApiData();
      },
      /*  取消选中 */ 
      clearSelection () {
        this.$refs.table.clearSelection();
      },
      /* 排序变化 */
      onSortChange (option) {
        console.log(option)
        let prop = option.prop.split('.')[option.prop.split('.').length - 1]
        let orderOption = option.order === 'ascending' ? prop : '-' + prop
        this.orderOption = orderOption
        this.getApiData()
      }
    },
  }
</script>