<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 头部渲染 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="inputval" class="input-with-select" clearable @change="seach">
            <el-button slot="append" icon="el-icon-search" @click="seach"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 内容渲染 -->
      <el-table :data="datas" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column prop="address" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeboolean(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作模块 -->
        <el-table-column prop="address" label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" @click="edituser(scope.row.id)" circle></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="open(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-s-tools" circle @click="showsettype(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination @size-change="sizechange" @current-change="currentchange" :page-sizes="[1, 2, 3, 4]"
        :page-size="indodata.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="res.total">
      </el-pagination>
    </el-card>
    <!-- 添加用户模块 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%" ref="addformref" @close="resetadd">
      <el-form :model="addform" :rules="rules" ref="addformref" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addusers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户修改模块 -->
    <el-dialog title="修改用户列表" :visible.sync="showeditdialog" width="40%" @close="resetedit">
      <el-form ref="formref" :model="editform" label-width="80px" :rules="rules">
        <el-form-item label="用户名">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showeditdialog = false">取 消</el-button>
        <el-button type="primary" @click="editdata">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色模块 -->
    <el-dialog title="分配角色" :visible.sync="showsetdialog" width="40%">
      <div>
        <p style="font-size:18px;margin: 5px;">当前的用户：{{userinfo.username}}</p>
        <p style="font-size:18px;margin: 5px;">当前的角色：{{userinfo.role_name}}</p>
        <p style="font-size:18px;margin: 8px;">分配新角色：
          <el-select v-model="selectval" placeholder="请选择">
            <el-option v-for="item in selectdata" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showsetdialog = false">取 消</el-button>
        <el-button type="primary" @click="checkrole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    const checkemail = (rule, value, cb) => {
      const regemail = /^[1-9][0-9]{4,10}@qq.com$/
      if (regemail.test(value)) {
        return cb()
      } else {
        return cb(new Error('邮箱格式不正确'))
      }
    }
    const checkmoile = (rule, value, cb) => {
      const regmoile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regmoile.test(value)) {
        return cb()
      } else {
        return cb(new Error('电话号码格式不正确'))
      }
    }
    return {
      inputval: '',
      indodata: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      datas: [],
      res: [],
      dialogVisible: false,
      showeditdialog: false,
      showsetdialog: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editform: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6到 11 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6到 11 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkmoile, trigger: 'blur' }
        ],
      },
      userinfo: [],
      selectval: '',
      selectdata: []
    }
  },
  methods: {
    async getdatas() {
      const { data: res } = await this.$http.get('users', { params: this.indodata })
      this.datas = res.data.users
      // console.log(this.datas.index)
      this.res = res.data
      // console.log(this.res)
    },
    seach() {
      this.indodata.query = this.inputval
      this.getdatas()
    },
    async changeboolean(val) {
      console.log(val)
      const { data: res } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('修改状态失败');
      } else {
        this.$message({
          message: '修改状态成功',
          type: 'success'
        });
      }
    },
    sizechange(val) {
      // console.log(val)
      this.indodata.pagesize = val
      console.log(this.indodata.pagesize)
      this.getdatas()
    },
    currentchange(val) {
      // console.log(val)
      this.indodata.pagenum = val
      console.log(this.indodata.pagenum)
      this.getdatas()
    },
    resetadd() {
      this.$refs.addformref.resetFields()
    },
    //添加用户
    addusers() {
      this.$refs.addformref.validate(async (valid) => {
        // console.log(valid)
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.post('users', this.addform)
          // console.log(res)
          if (res.meta.status === 201) {
            this.$message({
              message: '恭喜你，添加成功',
              type: 'success'
            });
            this.getdatas()
            this.dialogVisible = false
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    //修改用户
    async edituser(id) {
      // console.log(id)
      this.showeditdialog = true
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      this.editform = res.data
    },
    resetedit() {
      this.$refs.formref.resetFields()
    },
    editdata() {
      this.$refs.formref.validate(async (valid) => {
        // console.log(valid)
        if (valid) {
          const { data: res } = await this.$http.put('users/' + this.editform.id, {
            email: this.editform.email,
            mobile: this.editform.mobile
          })
          console.log(res)
          if (res.meta.status === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.showeditdialog = false
            this.getdatas()
          } else {
            this.$message.error('修改失败');
          }
        }
      })
    },
    //删除按钮
    open(id) {
      // console.log(this.$confirm)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getdatas()
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async showsettype(value) {
      this.userinfo = value
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      this.selectdata = res.data
      this.showsetdialog = true
    },
    async checkrole() {
      if (this.selectval) {
        const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, { rid: this.selectval })
        // console.log(res)
        if (res.meta.status === 200) {
          this.getdatas()
          this.showsetdialog = false
          return this.$message({
            message: '分配新角色成功',
            type: 'success'
          });
        } else {
          return this.$message.error('分配新角色失败')
        }
      } else {
        return this.$message.error('分配新角色不能为空')
      }
    }
  },
  created() {
    this.getdatas()
  }
}
</script>
<style scoped>
.box-card {
  margin-top: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>