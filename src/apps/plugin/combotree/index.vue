<!--
 *  下拉树组件
 *  @author linyx
 *  @date  2017-09-25
-->
<template>
  <div v-clickoutside="closeOptions">
    <div @click="toggleOptions">
      <el-input
        :props="comboProps"
        v-model="selectedLabel"
        :icon="comboIcon"
        placeholder="请选择"
        readonly="readonly"
        type="text"/>
    </div>
    <div class="el-scrollbar" v-show="showOptions" :style="{'position':'absolute','z-index':'10','overflow': 'auto','width':'100%',height: panelHeight || 'auto'}">
      <el-tree
        ref="tree"
        :check-strictly="checkStrictly"
        default-expand-all
        :node-key="comboProps.value"
        :show-checkbox="multiple"
        :current-node-key="multiple ? '': this.value"
        :highlight-current="!multiple"
        :data="treeData"
        :props="dataProps"
        @check-change="checkChange"
        @current-change="handleNodeClick"></el-tree>
    </div>
  </div>
</template>

<script>
import Clickoutside from "../lib/clickoutside";
export default {
  directives: { Clickoutside },
  props: {
    value: {
      type: [String, Number, Array]
    },
    /* 数据 */
    treeData: {
      type: Array,
      default: [],
      required: true
    },
    /* 树型数据配置选项 */
    dataProps: {
      type: Object,
      default: {
        children: "children",
        label: "name"
      },
      required: false
    },
    /* 下拉框绑定的属性 */
    comboProps: {
      type: Object,
      default: {
        value: "id",
        label: "name"
      },
      required: false
    },
    /** 多选 */
    multiple: {
      type: Boolean,
      default: false
    },
    /** 是否启用严格模式（复选） */
    checkStrictly: {
      type: Boolean,
      default: true
    },
    /** 面板高度 */
    panelHeight: {
      type: [Number, String],
      default: "auto"
    }
  },
  computed: {},
  data() {
    let defvalue = this.value;
    if (typeof defvalue == "string" || typeof defvalue == "number") {
      defvalue = [defvalue];
    } else {
      defvalue = this.value.concat([]);
    }
    return {
      /* 绑定值 */
      currentValue: this.value,
      /* 树形数据默认值 */
      defaultData: defvalue,
      comboIcon: "caret-bottom",
      showOptions: false,
      selectedLabel: ""
    };
  },
  watch: {
    showOptions() {
      this.comboIcon = this.showOptions ? "caret-top" : "caret-bottom";
    },
    currentValue(val) {
      this.$emit("input", val);
    }
  },
  mounted() {
    this.setSelected();
  },
  methods: {
    setSelected() {
      if (this.multiple && this.defaultData && this.defaultData.length > 0) {
        this.$refs.tree.setCheckedKeys(this.defaultData, false);
      } else if (!this.multiple && this.value) {
        let node = this.getNodeDataBykey(this.treeData, this.value);
        this.selectedLabel = node && node[this.comboProps.label];
      }
    },
    /** 根据id获取节点数据 */
    getNodeDataBykey(data, key) {
      let node;
      for (let index in data) {
        let item = data[index];
        if (item[this.comboProps.value] == key) {
          node = item;
          break;
        } else if (
          item[this.dataProps.children] &&
          item[this.dataProps.children].length
        ) {
          node = this.getNodeDataBykey(item[this.dataProps.children], key);
        }
      }
      return node;
    },
    toggleOptions() {
      this.showOptions = !this.showOptions;
    },
    /** 关闭面板 */
    closeOptions() {
      this.showOptions = false;
    },
    /** 节点点击事件 */
    handleNodeClick(data, node) {
      if (!this.multiple) {
        this.selectedLabel = data[this.comboProps.label];
        this.currentValue = data[this.comboProps.value];
        this.$emit("node-click", data[this.comboProps.value]);
        this.showOptions = false;
      }
    },
    /** 选择改变 */
    checkChange(data, checked) {
      if (this.multiple) {
        // this.currentValue = this.$refs.tree.getCheckedKeys(true);
        let nodes = this.$refs.tree.getCheckedNodes(),
          labels = [],
          values = [];
        for (let i in nodes) {
          labels.push(nodes[i][this.dataProps.label]);
          values.push(nodes[i][this.comboProps.value]);
        }
        this.selectedLabel = labels.join();
        this.currentValue = values;
      }
    }
  }
};
</script>

<style>

</style>
