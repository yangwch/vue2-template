<template>
  <el-menu :default-active="$route.path" :theme="theme" router class="sub-menus">
    <submenu :data="item" v-for="(item, index) in data" :key="item.id"></submenu>
  </el-menu>
</template>
<script>
  import submenu from './submenu'
  export default {
    components: {
      submenu
    },
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      theme: {
        type: String
      }
    }
  }
</script>