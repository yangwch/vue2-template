<template>
  <yt-list :title="title" :search-field="searchField" :search-label="searchLabel" :search-api="searchApi" :params="{dataId: 2}" ref="list">
    <!--操作按鈕-->
    <template slot="buttons">
        <el-button type="default">创建</el-button>
    </template>
    <template slot="search">
      <el-form :inline="true" :model="formInline" style="float:right" class="form-inline right">
        <el-form-item label="">
            <el-input v-model="formInline.user" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-select v-model="formInline.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!--数据列表 显示的列-->
    <template slot="columns">
      <!-- 多选列，需要多选时添加这列 -->
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        property="department"
        label="部门">
      </el-table-column>
      <el-table-column
        property="userName"
        label="用户姓名">
      </el-table-column>
    </template>
  </yt-list>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      searchField: "username",
      searchLabel: "输入用户名",
      title: "用户登录记录",
      searchApi: data => {
        console.log(data);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              result: {
                total: 10,
                rows: [
                  {
                    id: 1,
                    userName: "张三",
                    department: "事业部"
                  },
                  {
                    id: 2,
                    userName: "张三",
                    department: "事业部"
                  },
                  {
                    id: 3,
                    userName: "张三",
                    department: "事业部"
                  },
                  {
                    id: 4,
                    userName: "张三",
                    department: "事业部"
                  },
                  {
                    id: 5,
                    userName: "张三",
                    department: "事业部"
                  }
                ]
              }
            });
          }, 2000);
        });
      }
    };
  },
  methods: {
    /** 刷新 */
    onSearch() {
      this.$refs.list.refresh(this.formInline);
    }
  }
};
</script>
