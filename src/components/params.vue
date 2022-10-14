<template>
  <div class="params">
    <!-- 头部渲染 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <p>
        <span>选择商品分类：</span>
        <el-cascader v-model="selectval" :options="selectdata" :props="{ expandTrigger: 'hover',...optionsdata }"
          clearable @change="handleChange" style="width:40%">
        </el-cascader>
      </p>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" plain @click="openadddata">添加参数</el-button>
          <el-table :data="leftdata" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="item.attr_id" closable
                  @close="closetagdata(i,scope.row)">
                  {{item}}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="addtagdata" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"
                  style="width:15%">
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="openeditdata(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="opendel(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" plain @click="openadddata">添加属性</el-button>
          <el-table :data="rightdata" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="item.attr_id" closable
                  @close="closetagdata(i,scope.row)">
                  {{item}}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="addtagdata" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"
                  style="width:15%">
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="openeditdata(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="opendel(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加dialog -->
      <el-dialog title="添加参数" :visible.sync="adddialog" width="50%" @close="resetadddata">
        <el-form ref="addformref" :model="adddata" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="attr_name">
            <el-input v-model="adddata.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialog = false">取 消</el-button>
          <el-button type="primary" @click="sendadddata">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑dialog -->
      <el-dialog title="添加属性" :visible.sync="editdialog" width="50%" @close="reseteditdata">
        <el-form ref="editformref" :model="editdata" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="attr_name">
            <el-input v-model="editdata.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialog = false">取 消</el-button>
          <el-button type="primary" @click="sendeditdata">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>

export default {
  data() {
    return {
      selectdata: [],
      selectval: [],
      optionsdata: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      id: '',
      leftdata: [],
      rightdata: [],
      //添加
      adddialog: false,
      adddata: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ]
      },
      //编辑
      editdialog: false,
      editdata: [],
      addtagdata: '',
      inputVisible: false

    }
  },
  methods: {
    async getdatas() {
      const { data: res } = await this.$http.get('/categories')
      this.selectdata = res.data
      console.log(this.selectdata)
    },
    //更换选择商品
    handleChange() {
      console.log(this.selectval)
      if (this.selectval.length !== 3) {
        this.selectval = []
        this.leftdata = []
        this.rightdata = []
        this.id = ''
        return this.$message({
          message: '请选择商品分类',
          type: 'warning'
        });
      } else {
        this.id = this.selectval[this.selectval.length - 1]
        this.handleClick()
      }
    },
    //tabs 点击事件
    async handleClick() {
      // console.log(this.activeName)
      // console.log(this.selectval)
      const { data: res } = await this.$http.get(`categories/${this.id}/attributes`, { params: { sel: this.activeName } })
      console.log(res)
      if (res.meta.status === 200) {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.inputVisible = false
        })
        if (this.activeName === 'many') {
          this.leftdata = res.data
          // console.log(this.leftdata)
        } else {
          this.rightdata = res.data
        }
      } else {
        return this.$message.error('数据获取失败')
      }
    },


    //打开adddialog
    openadddata() {
      if (!this.id) {
        return this.$message.error('请选择商品分类')
      } else {
        this.adddata.attr_sel = this.activeName
        this.adddialog = true
        // console.log(this.adddata)
      }
    },
    //重置
    resetadddata() {
      this.$refs.addformref.resetFields()
    },
    //添加到数据库
    sendadddata() {
      this.$refs.addformref.validate(async valid => {
        if (!valid) {
          return
        } else {
          if (this.adddata.attr_name.trim().length === 0) {
            return this.$message.error('不能为空格')
          }
          const { data: res } = await this.$http.post(`categories/${this.id}/attributes`, this.adddata)
          // console.log(res)
          this.handleClick()
          this.adddialog = false
          if (res.meta.status === 201) {
            return this.$message({
              type: 'success',
              message: '添加成功'
            })
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },

    // 重置
    reseteditdata() {
      this.$refs.editformref.resetFields()
    },
    //打开editdialog,获取数据
    async openeditdata(val) {
      console.log(val)
      const { data: res } = await this.$http.get(`categories/${this.id}/attributes/${val}`)
      console.log(res)
      this.editdialog = true
      if (res.meta.status !== 200) {
        return this.$message.error('请求数据失败')
      } else {
        this.editdata = res.data
        console.log(this.editdata)
      }
    },
    //将数据送到数据库
    sendeditdata() {
      this.$refs.editformref.validate(async valid => {
        if (!valid) {
          return
        } else {
          if (this.editdata.attr_name.trim().length === 0) {
            return this.$message.error('不能为空格')
          }
          const { data: res } = await this.$http.put(`categories/${this.id}/attributes/${this.editdata.attr_id
            }`, { attr_name: this.editdata.attr_name, attr_sel: this.activeName, attr_vals: this.editdata.attr_vals })
          console.log(res)
          this.editdialog = false
          this.handleClick()
          if (res.meta.status === 200) {
            return this.$message({
              type: 'success',
              message: '修改成功'
            })
          } else {
            return this.$message.error('修改失败')
          }
        }
      })
    },
    //删除
    async opendel(id) {
      const delboolean = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(delboolean)
      if (delboolean === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${this.id}/attributes/${id}`)
        console.log(res)
        this.handleClick()
        if (res.meta.status === 200) {
          return this.$message({
            type: 'success',
            message: '删除成功'
          })
        } else {
          return this.$message.error('删除失败')
        }
      }
    },
    //显示input
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
      console.log(row)
    },
    //添加
    async handleInputConfirm(row) {
      row.inputVisible = false
      if (this.addtagdata.trim().length === 0) {
        this.addtagdata = ''
        return
      } else {
        let addarr = row.attr_vals
        addarr.push(this.addtagdata)
        addarr = addarr.join(',')
        this.addtagdata = ''
        const { data: res } = await this.$http.put(`categories/${this.id}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: addarr })
        if (res.meta.status === 200) {
          return this.$message({
            type: 'success',
            message: '修改成功'
          })
        } else {
          return this.$message.error('修改失败')
        }
      }
    },
    //删除
    async closetagdata(i, row) {
      row.attr_vals.splice(i, 1)
      let addarr = row.attr_vals
      // addarr.push(this.addtagdata)
      addarr = addarr.join(',')
      // this.addtagdata = ''
      const { data: res } = await this.$http.put(`categories/${this.id}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: addarr })
      if (res.meta.status === 200) {
        return this.$message({
          type: 'success',
          message: '修改成功'
        })
      } else {
        return this.$message.error('修改失败')
      }
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

.el-cascader {
  margin: 15px 0;
}

.el-table {
  margin-top: 15px;
}

.el-tag {
  margin: 0 15px;
  margin-top: 15px;
}
</style>