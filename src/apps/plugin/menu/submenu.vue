<template>
  <el-menu-item v-if="data.children == null || data.children.length == 0" :index="data.attributes.url" class="custom-submenu"><i :class="data.attributes.icon || ''"></i><span slot="title">{{data.text}}</span></el-menu-item>
  <el-submenu v-else :index="data.id.toString()" class="custom-submenu">
    <template slot="title"><i :class="data.attributes.icon || ''"></i><span v-text="data.text"></span></template>
    <yt-submenu :data="item" v-for="(item, index) in data.children" :key="index"></yt-submenu>
  </el-submenu>
</template>
</template>
<script>
  import submenu from './submenu'
  export default {
    data () {
      return {}
    },
    props: {
      data: {
        type: [Array, Object],
        default () {
          return []
        }
      }
    }
  }
</script>