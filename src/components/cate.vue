<template>
  <div class="cate">
    <!-- 头部渲染 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体部分 -->
    <el-card class="box-card">
      <el-button type="primary" class="adduser" @click="addevent">添加用户</el-button>
      <tree-table :data='datas' :columns="columns" :selection-type="false" :expand-type="false" show-index
        index-text="#" border :show-row-hover="false">
        <!-- 是否ok有效 -->
        <template slot="likes" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:lightgreen"></i>
        </template>
        <!-- 排序等级 -->
        <template slot="isup" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="ptn" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editfunction(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deldata(scope.row)"></el-button>
        </template>
      </tree-table>
      <!-- 分页器 -->
      <el-pagination @current-change="handleCurrentChange" :page-size="5" layout="total, prev, pager, next, jumper"
        :total="alldatas.length">
      </el-pagination>
      <!-- 添加dialog -->
      <el-dialog title="添加分类" :visible.sync="adddialog" width="50%" @close="resetform">
        <el-form ref="addformref" :model="addform" :rules="rules" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addform.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类层级" prop="selectdata">
            <el-cascader v-model="selectdata" :options="selectarr"
              :props="{ expandTrigger: 'hover',checkStrictly: true,...selection }" style="width:100%" clearable
              @change="selectchange">
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialog = false">取 消</el-button>
          <el-button type="primary" @click="addformdata">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑dialog -->
      <el-dialog title="修改分类" :visible.sync="editdialog" width="50%" @close="resetedit">
        <el-form ref="editformref" :model="editdata" label-width="80px" :rules="rules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editdata.cat_name" @change="change"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialog = false">取 消</el-button>
          <el-button type="primary" @click="editaddform">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      datas: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        }, {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'likes'
        }, {
          label: '排序等级',
          prop: 'cat_level',
          type: 'template',
          template: 'isup'
        }, {
          label: '操作',
          // prop: '',
          type: 'template',
          template: 'ptn'
        }
      ],
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      alldatas: [],
      //添加
      adddialog: false,
      addform: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      selectdata: [],
      selectarr: [],
      selection: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //编辑
      editdialog: false,
      editdata: [],
    }
  },
  methods: {
    //指定页码数据
    async getdatas() {
      const { data: res } = await this.$http.get('/categories', { params: this.queryinfo })
      // console.log(res)
      this.getalldata()
      this.datas = res.data.result
      // console.log(this.datas)
    },
    //所有列表数据
    async getalldata() {
      const { data: res } = await this.$http.get('/categories')
      // console.log(res)
      this.alldatas = res.data
      // console.log(this.alldatas)
    },
    //分页器执行函数
    async handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getdatas()
    },
    //添加用户执行函数
    addevent() {
      this.getoptiondata()
      this.adddialog = true
    },
    //前两级数据
    async getoptiondata() {
      const { data: res } = await this.$http.get('/categories', { params: { type: 2 } })
      // console.log(res)
      this.selectarr = res.data
      // console.log(this.selectarr)
    },
    //改变值触发的函数
    selectchange() {
      console.log(this.selectdata)
    },
    //清空
    resetform() {
      this.$refs.addformref.resetFields()
      this.selectdata = []
      // console.log(this.addform)
      this.addform.cat_level = ''
      this.addform.cat_pid = ''
    },
    //得到参数
    getnumsdata() {
      if (this.selectdata.length > 0) {
        this.addform.cat_pid = this.selectdata[this.selectdata.length - 1]
        this.addform.cat_level = this.selectdata.length
        return
      } else {
        this.addform.cat_level = 0
        this.addform.cat_pid = 0
      }
    },
    //添加的执行函数
    async addformdata() {
      this.$refs.addformref.validate(async valid => {
        if (!valid) {
          return
        } else {
          this.getnumsdata()
          const { data: res } = await this.$http.post('/categories', this.addform)
          // console.log(res)
          this.getdatas()
          this.adddialog = false
          if (res.meta.status === 201) {
            return this.$message({
              type: 'success',
              message: '添加成功',
            })
          } else {
            return this.$message.error('添加失败')
          }
        }
      })
    },
    //编辑
    editfunction(val) {
      // console.log(val)
      this.editdata = val
      console.log(this.editdata)
      this.editdialog = true
    },
    //重置
    resetedit() {
      this.$refs.editformref.resetFields()
    },
    //添加执行函数
    async editaddform() {
      this.$refs.editformref.validate(async valid => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.put(`/categories/${this.editdata.cat_id}`, { cat_name: this.editdata.cat_name })
          // console.log(res)
          this.getdatas()
          this.editdialog = false
          if (res.meta.status === 200) {
            return this.$message({
              message: '更新成功',
              type: 'success'
            })
          } else {
            return this.$message.error('更新失败')
          }
        }
      })
    },
    //删除
    async deldata(val) {
      const delboolean = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(delboolean)
      if (delboolean === 'confirm') {
        const { data: res } = await this.$http.delete(`/categories/${val.cat_id}`)
        // console.log(res)
        this.getdatas()
        if (res.meta.status === 200) {
          return this.$message({
            type: 'success',
            message: '删除成功'
          })
        } else {
          return this.$message.error('删除失败')
        }
      } else {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        });
      }
    },
    change() {
      console.log(this.editdata.cat_name)
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

.adduser {
  margin-bottom: 15px;
}

.el-pagination {
  margin-block: 15px;
}

.el-cascader-menu {
  display: flex;
  border-radius: 4px;
  font-size: 14px;
  height: 300px;
}
</style>