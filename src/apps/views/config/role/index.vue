<template>
  <mmbs-list :options="{
    title: '角色信息',
    collectionName: 'roleList',
    add: true,
    edit: true,
    delete: true,
    columns: [
      {title: '名称', field: 'name', width: 150},
      {title: '创建时间', field: 'createdAt', type: 'date', width: 150, edit: false, format: 'YYYY-MM-DD'},
      {title: '说明', field: 'remark', type: 'textarea'}
    ],
    query: { },
    search: true,
    searchField: 'name',
    searchLabel: '输入名称'
  }">
    <template slot="buttons">
      <el-button>授权</el-button>
    </template>
  </mmbs-list>
</template>
<style lang="less" scoped>
</style>
<script type="text/javascript">
export default {
  components: { },
  data () {
    return {}
  },
  created () {
  },
  methods: {
  }
}
</script>