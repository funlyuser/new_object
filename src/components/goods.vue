<template>
  <div class="goods">
    <!-- 头部渲染 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="seachdata" class="input-with-select" clearable @clear="seach"
            @change="seach">
            <el-button slot="append" icon="el-icon-search" @click="seach"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">
            <router-link to="/add">添加商品</router-link>
          </el-button>
        </el-col>
      </el-row>
      <!-- 主体内容 -->
      <el-table :data="datas" style="width: 100%" border stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="750px">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="117px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="96px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time|dateformat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="deldata(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="10"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      datas: [],
      seachdata: '',
      total: 0
    }
  },
  methods: {
    //获取数据
    async getdatas() {
      const { data: res } = await this.$http.get('goods', { params: this.queryinfo })
      console.log(res)
      this.total = res.data.total
      this.datas = res.data.goods
      console.log(this.datas)
      if (res.meta.status === 200) {
        return
      } else {
        return this.$message.error('数据获取失败')
      }
    },
    //搜索功能
    seach() {
      this.queryinfo.query = this.seachdata
      this.queryinfo.pagenum = 1
      this.queryinfo.pagesize = 10
      this.getdatas()
    },
    handleSizeChange(val) {
      // console.log(val)
      this.queryinfo.pagesize = val
      this.getdatas()
    },
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getdatas()
    },
    //删除数据
    async deldata(val) {
      console.log(val)
      const boolean = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (boolean === 'confirm') {
        const { data: res } = await this.$http.delete(`/goods/${val}`)
        this.getdatas()
        if (res.meta.status === 200) {
          return this.$message.success('删除成功')
        } else {
          return this.$message.error('删除失败')
        }
      } else {
        return this.$message.info('已取消删除')
      }
    },
  },
  created() {
    this.getdatas()
  },
}
</script>
<style scoped>
.el-card {
  margin-top: 15px;
}

.el-table {
  margin-top: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>