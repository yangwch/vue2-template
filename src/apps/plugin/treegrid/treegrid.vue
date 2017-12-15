<!--
 *  树表格组件
 *  @author yangwp
 *  @date 2017-07-21
 *  @events on-row-click 单击行或者单击操作按钮方法
 *  @events on-selection-change  多选模式下 选中项变化时触发
 *  @events on-sort-change  排序时有效，当点击排序时触发
 *  @props    items 显示的结构化数据
            columns 表格列的配置描述 sortable:true 开启排序功能
            type: 'selection'为多选功能 type: 'action' 为操作功能 actions:[{}] 操作按钮
 *  @methods getChecked 获取选中的id，
             getSelected
-->
<template>
  <div :style="{width:tableWidth}" class='autoTbale'>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th v-for="(column,index) in cloneColumns" :style="tdStyle(column.width, column.type === 'selection' ? 'center' : column.align)">
          <el-checkbox v-model="checks" @click.prevent.native="handleCheckAll" v-if="column.type === 'selection'"></el-checkbox>
          <label v-else>
              {{ renderHeader(column, index) }}
          </label>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in initItems" v-show="show(item) && reload" :class="{'child-tr':item.parent, 'selected': item._selected}" @click="RowClick(item, index)">
          <td v-for="(column,snum) in columns" :style="tdStyle(column.width, column.align)">
              <el-checkbox-group v-model="checkGroup" @on-change="checkAllGroupChange" v-if="column.type === 'selection'">
                  <el-checkbox :label="item.id"><span style="display:none;">&nbsp;</span></el-checkbox>
              </el-checkbox-group>
              <div v-if="column.type === 'action'">
                  <el-button :type="action.type" size="small" @click="RowActionClick(item,$event,index)" v-for='action in (column.actions)' :key='column.text'>{{action.text}}</el-button>
              </div>
              <label @click="toggle(index,item)" v-if="!column.type">
                  <span v-if='column.treeField'>
                      <i v-html='item.spaceHtml'></i>
                      <i v-if="item.children&&item.children.length>0" :class="{'el-icon-caret-right':!item.expanded,'el-icon-caret-bottom':item.expanded }"></i>
                      <i v-else class="ms-tree-space"></i>
                  </span>
                  <span v-html="renderBody(item,column)"></span>
              </label>
          </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang="less" scoped>
.autoTbale {
  overflow: auto;
  tbody .el-checkbox-group {
    text-align: center;
  }
  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
  }

  .table-bordered {
    border: 1px solid #ebebeb;
  }

  .table > tbody > tr > td,
  .table > tbody > tr > th,
  .table > thead > tr > td,
  .table > thead > tr > th {
    border-top: 1px solid #e7eaec;
    line-height: 1.42857;
    padding: 8px;
    vertical-align: middle;
  }
  .table > tbody > tr.selected {
    background: #edf7ff;
  }

  .table-bordered > tbody > tr > td,
  .table-bordered > tbody > tr > th,
  .table-bordered > tfoot > tr > td,
  .table-bordered > tfoot > tr > th,
  .table-bordered > thead > tr > td,
  .table-bordered > thead > tr > th {
    border: 1px solid #e7e7e7;
  }

  .table > thead > tr > th {
    border-bottom: 1px solid #ddd;
  }

  .table-bordered > thead > tr > td,
  .table-bordered > thead > tr > th {
    background-color: #f5f5f6;
  }

  label {
    margin: 0 8px;
  }

  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 14px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: "";
  }
}
</style>
<script>
export default {
  name: "yt-tree-grid",
  props: {
    /**
     * 要显示的列
     * （type: 'selection' 会变为多选列）
     */
    columns: Array,
    /**
     *  数据列表
     */
    items: Array,
    /**
     * 是否默认展开
     * */
    expanded: Boolean
  },
  data() {
    return {
      reload: true,
      initItems: [], // 处理后数据数组
      cloneColumns: [], // 处理后的表头数据
      checkGroup: [], // 复选框数组
      checks: false, // 全选
      screenWidth: document.body.clientWidth, // 自适应宽
      tdsWidth: 0, // td总宽
      timer: false, // 控制监听时长

      selectedRow: null
    };
  },
  computed: {
    tableWidth() {
      return this.tdsWidth > this.screenWidth && this.screenWidth > 0
        ? this.screenWidth + "px"
        : "100%";
    }
  },
  watch: {
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        setTimeout(() => {
          this.timer = false;
        }, 400);
      }
    },
    items() {
      if (this.items) {
        this.checks = false;
        this.initItems = [];
        this.initData(this.items, 1, null);
      }
    },
    columns: {
      handler() {
        this.cloneColumns = this.makeColumns();
      },
      deep: true
    }
  },
  mounted() {
    if (this.items) {
      this.initData(this.items, 1, null);
      this.cloneColumns = this.makeColumns();
    }
    //  绑定onresize事件 监听屏幕变化设置宽
    this.$nextTick(() => {
      this.screenWidth = document.body.clientWidth;
    });
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
      })();
    };
  },
  methods: {
    //  设置td宽度
    tdStyle(width, align) {
      if (width || align) {
        return {
          "min-width": width + "px",
          "text-align": align || "left"
        };
      }
    },
    //  排序事件
    handleSort(index, type) {
      this.cloneColumns.forEach(col => (col._sortType = "normal"));
      if (this.cloneColumns[index]._sortType === type) {
        this.cloneColumns[index]._sortType = "normal";
      } else {
        this.cloneColumns[index]._sortType = type;
      }
      this.$emit(
        "on-sort-change",
        this.cloneColumns[index]["key"],
        this.cloneColumns[index]["_sortType"]
      );
    },
    //  点击某操作按钮事件
    RowActionClick(data, event, index) {
      this.$emit("on-row-click", data, event, index);
    },
    /* 行点击 */
    RowClick(data, index) {
      this.reload = false;
      if (this.selectedRow) {
        this.selectedRow._selected = false;
      }
      (this.selectedRow = data), (data._selected = true), (this.reload = true);
    },
    //  处理表头数据
    makeColumns() {
      let columns = this.deepCopy(this.columns);
      this.tdsWidth = 0;
      columns.forEach((column, index) => {
        column._index = index;
        column._width = column.width ? column.width : "";
        column._sortType = "normal";
        this.tdsWidth += column.width ? parseFloat(column.width) : 0;
      });
      return columns;
    },
    /* 获取空格 */
    getSpaceHtml(level) {
      let spaceHtml = "";
      for (var i = 1; i < level; i++) {
        spaceHtml +=
          "<i class='ms-tree-space' style='display:inline-block;width:14px;line-height:1;height:14px;'></i>";
      }
      return spaceHtml;
    },
    //  数据处理 增加自定义属性监听
    initData(items, level, parent) {
      // this.initItems = []
      /* 添加空格 */
      let spaceHtml = this.getSpaceHtml(level);

      items.forEach((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
          spaceHtml: spaceHtml
        });
        if (typeof item.expanded == "undefined") {
          item = Object.assign({}, item, {
            expanded: this.expanded
          });
        }
        /* 是否显示 */
        if (
          typeof item.isShow == "undefined" ||
          (parent && parent.expanded == false)
        ) {
          item = Object.assign({}, item, {
            isShow: this.expanded
          });
        } else if (parent.expanded) {
          item = Object.assign({}, item, {
            isShow: true
          });
        }

        this.initItems.push(item);
        if (item.children) {
          this.initData(item.children, level + 1, item);
        }
      });
    },
    //   隐藏显示
    show(item) {
      return item.level == 1 || (item.parent && item.isShow);
    },
    toggle(index, item) {
      let level = item.level + 1;
      let spaceHtml = this.getSpaceHtml(level);
      if (item.children) {
        if (item.expanded) {
          this.close(index, item);
        } else {
          this.open(index, item);
        }
        item.expanded = !item.expanded;
      }
    },
    /* 展开 */
    open(index, item) {
      if (item.children) {
        this.reload = false;
        let self = this;
        this.initItems.forEach(function(firstLelItem, fIndex) {
          item.children.forEach((child, childIndex) => {
            if (firstLelItem.id == child.id) {
              firstLelItem.isShow = true;
              if (firstLelItem.expanded) {
                self.open(fIndex, child);
              }
            }
          });
        });
        this.reload = true;
      }
    },
    /* 关闭 */
    close(index, item) {
      if (item.children) {
        this.reload = false;
        let self = this;
        this.initItems.forEach(function(firstLelItem, fIndex) {
          item.children.forEach((child, childIndex) => {
            if (firstLelItem.id == child.id) {
              /* 隐藏，收起 */
              // firstLelItem.expanded = false
              firstLelItem.isShow = false;
              if (child.children && child.children.length) {
                self.close(fIndex, child);
              }
              return true;
            }
            return false;
          });
        });

        this.reload = true;
      }
    },
    // checkbox 全选 选择事件
    /** @function */
    handleCheckAll() {
      this.checks = !this.checks;
      if (this.checks) {
        this.checkGroup = this.checkGroup.concat(this.All(this.items));
      } else {
        this.checkGroup = [];
      }
      this.$emit("on-selection-change", this.checkGroup);
    },
    /**
     * 单个选择
     *
     * @private
     * @param {Object} data
     * @fires Hurl#on-selection-change
     * @returns none
     */
    checkAllGroupChange(data) {
      if (data.length === this.items.length) {
        this.checks = true;
      } else {
        this.checks = false;
      }
      /**
       * 选择改变事件
       *
       * @event Hurl#on-selection-change
       * @type {object}
       * @property {Object} checkGroup - 选中的数据
       */
      this.$emit("on-selection-change", this.checkGroup);
    },
    /**
     *  多选，获取选中记录
     *
     * @public
     * @version 1.0.0
     * @param  none
     * @returns {Array} CheckGroup
     */
    getChecked() {
      return this.checkGroup;
    },
    /**
     * 单选，获取选中
     *
     * @public
     * @param none
     * @returns {Object} selectedRow
     */
    getSelected() {
      return this.deepCopy(this.selectedRow);
    },
    All(data) {
      let arr = [];
      data.forEach(item => {
        arr.push(item.id);
        if (item.children && item.children.length > 0) {
          arr = arr.concat(this.All(item.children));
        }
      });
      return arr;
    },
    //  返回表头
    renderHeader(column, $index) {
      if ("renderHeader" in this.columns[$index]) {
        return this.columns[$index].renderHeader(column, $index);
      } else {
        return column.title || "#";
      }
    },
    //  返回内容
    renderBody(row, column, index) {
      if (typeof column.formatter == "function") {
        return column.formatter(row[column.key], row, index);
      }
      return row[column.key];
    },
    deepCopy(data) {
      var t = this.type(data),
        o,
        i,
        ni;
      if (t === "array") {
        o = [];
      } else if (t === "object") {
        o = {};
      } else {
        return data;
      }
      if (t === "array") {
        for (i = 0, ni = data.length; i < ni; i++) {
          o.push(this.deepCopy(data[i]));
        }
        return o;
      } else if (t === "object") {
        for (i in data) {
          o[i] = this.deepCopy(data[i]);
        }
        return o;
      }
    },
    type(obj) {
      var toString = Object.prototype.toString;
      var map = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object"
      };
      return map[toString.call(obj)];
    },
    /**
     * 设置选中id，触发事件 'on-selection-change'
     *
     * @public
     * @param {Array} chkIds - 选中的id
     * @param {Array} isCheck - 是否选中
     * @returns none
     * */
    setChecked(chkIds, isCheck) {
      if (typeof chkIds == "string" || typeof chkIds == "number") {
        chkIds = [chkIds];
      }

      if (isCheck == null || isCheck == true) {
        this.checkGroup = this.checkGroup.concat(chkIds);
      } else {
        for (let k in chkIds) {
          let id = chkIds[k];
          let index = this.checkGroup.findIndex(item => {
            return item == id;
          });
          if (index >= 0) {
            this.checkGroup.splice(index, 1);
          }
        }
      }
      this.$emit("on-selection-change", this.checkGroup);
    },
    /**
     * 清除选择项
     *
     * @public
     * @version 1.0.0
     * */
    clearSelection() {
      this.checkGroup = [];
      this.checks = false;
    }
  }
};
</script>
