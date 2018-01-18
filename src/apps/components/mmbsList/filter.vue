<template>
  <table class="table">
    <tr v-for="(row, index) in filters" :key="index">
      <td>
        <el-select v-model="row.field" @change="onFieldChange(row)" placeholder="选择字段">
          <el-option
            v-for="(item, index) in columns"
            :key="index"
            :label="item.title"
            :value="item.field || ''">
          </el-option>
        </el-select>
      </td>
      <td>
        <el-select v-model="row.type" placeholder="选择类型">
          <el-option
            v-for="(item, index) in row.type_list"
            :key="index"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </td>
      <td>
        <!-- 数字 -->
        <el-input-number
          v-if="row.fieldType === 'number'"
          v-model="row.value"
          :min="row.min"
          :max="row.max"
          :controls="false"
          style="width: 100%">
        </el-input-number>
        <!-- 日期 -->
        <el-date-picker
          v-else-if="row.fieldType === 'datetime' || row.fieldType === 'date'"
          v-model="row.value"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        <!-- 字符串及其他 v-if="row.fieldType === 'text' || row.fieldType === 'textarea' || !row.fieldType" -->
        <el-input v-model="row.value" v-else/>
      </td>
      <td>
        <el-button icon="el-icon-remove-outline" plain @click="onRemoveRow(index)"></el-button>
      </td>
    </tr>
    <tr>
      <td colspan="4">
        <div class="text-right">
          <el-button @click="onClear">清除</el-button>
          <el-button @click="onAddRow">添加</el-button>
          <el-button type="primary" @click="onFilter">筛选</el-button>
        </div>
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  name: 'filterCompoent',
  props: {
    columns: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      filters: [{
        field: '',
        type: '',
        type_list: [],
        value: null
      }],
      fieldTypes: {
        text: [
          {text: '等于', value: 'equalTo'},
          {text: '不等于', value: 'notEqualTo'},
          {text: '包含', value: 'contains'}
        ],
        date: [
          {text: '小于', value: 'lessThan'},
          {text: '大于', value: 'greaterThan'}
        ],
        number: [
          {text: '小于', value: 'lessThan'},
          {text: '小于等于', value: 'lessThanOrEqualTo'},
          {text: '大于', value: 'greaterThan'},
          {text: '大于等于', value: 'greaterThanOrEqualTo'},
          {text: '等于', value: 'equalTo'},
          {text: '不等于', value: 'notEqualTo'}
        ]
      }
    }
  },
  methods: {
    onClear () {
      this.filters = []
      this.onAddRow()
    },
    /**
     * 过滤
     */
    onFilter () {
      let params = {}
      this.filters.map(item => {
        if (item.field && item.type && (item.value !== '' && typeof item.value !== 'undefined')) {
          params[item.field + '_' + Math.random().toString().replace(/\./g, '')] = {
            field: item.field,
            type: item.type,
            value: item.value
          }
        }
      })
      this.$emit('onFilter', params)
    },
    /**
     * 添加行
     */
    onAddRow () {
      this.filters.push({field: '', type: '', type_list: [], value: null})
    },
    /**
     * 移除行
     * @param index {Number} - 行号
     */
    onRemoveRow (index) {
      this.filters.splice(index, 1)
      if (this.filters.length === 0) {
        this.onAddRow()
      }
    },
    /**
     * 选择字段变化
     * @param row {Object} - 当前行
     */
    onFieldChange (row) {
      let field = row.field
      let column = this.columns.find(item => {
        return item.field === field
      })
      let fieldType = (column && column.type) || 'text'
      if (fieldType) {
        if (fieldType === 'text' || fieldType === 'textarea') {
          fieldType = 'text'
        } else if (fieldType === 'datetime' || fieldType === 'date') {
          fieldType = 'date'
        }
        row.type_list = this.fieldTypes[fieldType]
        row.fieldType = fieldType
        row.type = ''
      }
    }
  }
}
</script>

