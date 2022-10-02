<template>
  <div class="rightscontain">
    <!-- 头部渲染 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 内容渲染 -->
      <el-table :data="datas" style="width: 100%" stripe border height="800" highlight-current-row text-align="center">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: []
    }
  },
  methods: {
    async getdatas() {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.datas = res.data
      console.log(this.datas.index)

    }
  },
  created() {
    this.getdatas()
  }
}
</script>
<style scoped>
.el-card {
  margin-top: 15px;
}
</style>