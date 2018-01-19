<template>
  <el-menu :default-active="$route.path" router class="yt-menu">
    <submenu :data="item" v-for="(item, index) in data" :key="index"></submenu>
  </el-menu>
</template>
<style lang="less">
  .yt-menu {
    height: 100%;
    .el-menu {
      border-right: 0;
    }
    i {
      margin-right: 5px;
      font-size: 16px;
    }
  }
</style>

<script>
  import submenu from './submenu'
  export default {
    name: 'ytMenu',
    components: {
      submenu
    },
    props: {
      /**
       * 菜单数组数据
       */
      data: {
        type: Array,
        default () {
          return []
        }
      },
      /**
       * 是否收起
       */
      collapse: {
        type: Boolean,
        default () {
          return false
        }
      }
    }
  }
</script>