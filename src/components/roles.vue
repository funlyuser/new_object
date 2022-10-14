<template>
  <div class="rolescontain">
    <!-- 头部渲染 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="adddialog=true">添加角色</el-button>
      <el-table :data="formdata" border style="width: 100%" stripe>
        <el-table-column type="expand">
          <!-- 展开列 -->
          <template slot-scope="scope">
            <el-row v-for="(item,i1) in scope.row.children" :key="item.id" :class="['bottomborder',i1===0
            ? 'topborder' :'','vcenter','demo-table-expand']">
              <!-- 一级 -->
              <el-col :span="4" class="vcenter">
                <el-tag closable class="col" @close="deldata(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(item1,i2) in item.children" :key="item1.id" :class="[i2===0? '':'topborder','vcenter']">
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag type='success' closable class="col" @close="deldata(scope.row,item1.id)">
                      {{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag v-for="item2 in item1.children" :key="item2.id" closable type="warning" class="col"
                      @close="deldata(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column prop="" label="操作" width="400px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editformdatas(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deletedata(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="gettreedata(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户dialog -->
    <el-dialog title="添加角色" :visible.sync="adddialog" width="40%" @close="adddelval">
      <el-form ref="addformref" :model="addformdatas" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addformdatas.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addformdatas.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialog = false">取 消</el-button>
        <el-button type="primary" @click="sendaddform">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户dialog -->
    <el-dialog title="编辑角色" :visible.sync="editdialog" width="30%" @close="editdelval">
      <el-form ref="editformref" :model="editform" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialog = false">取 消</el-button>
        <el-button type="primary" @click="sendeditform">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色dialog -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%" @close="changekey">
      <el-tree :data="treedata" :props="treeprops" show-checkbox default-expand-all :default-checked-keys="keys"
        node-key="id" ref="treeref">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="settreedata">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formdata: [],
      // 添加角色
      adddialog: false,
      addformdatas: {
        roleName: '',
        roleDesc: '',
      },
      //编辑角色
      editdialog: false,
      editform: [],
      // 分配角色
      dialogVisible: false,
      treedata: [],
      treeprops: {
        children: 'children',
        label: 'authName'
      },
      keys: [],
      needdatas: [],
      roleid: '',
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    // 获取页面数据
    async getdatas() {
      const { data: res } = await this.$http.get('/roles')
      this.formdata = res.data
      // console.log(res)
    },
    //重置
    adddelval() {
      this.$refs.addformref.resetFields()
      // console.log(this.addformdatas)
    },
    editdelval() {
      this.$refs.editformref.resetFields()
    },
    // 添加
    sendaddform() {
      this.$refs.addformref.validate(async valid => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.post('roles', this.addformdatas)
          // console.log(res)
          if (res.meta.status == 201) {
            this.getdatas()
            this.adddialog = false
            return this.$message({
              message: '添加成功',
              type: 'success'
            });
          } else {
            this.adddialog = false
            return this.$message.error('添加失败')
          }
        }
      })
    },
    //编辑
    async editformdatas(value) {
      const { data: res } = await this.$http.get(`roles/${value}`)
      // console.log(res)
      this.editform = res.data
      // console.log(this.editform)
      this.editdialog = true
    },
    // 修改角色
    sendeditform() {
      this.$refs.editformref.validate(async valid => {
        if (!valid) {
          // console.log(valid)
          return
        } else {
          const { data: res } = await this.$http.put(`roles/${this.editform.roleId}`, this.editform)
          // console.log(res)
          if (res.meta.status === 200) {
            this.getdatas()
            this.editdialog = false
            return this.$message({
              message: '修改成功',
              type: 'success'
            })
          } else {
            this.editdialog = false
            return this.$message.error('修改失败')
          }
        }

      })
    },
    //删除角色
    deletedata(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + id + '')
        // console.log(res)
        if (res.meta.status === 200) {
          this.getdatas()
          return this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          return this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    // 删除权限
    async deldata(role, rightid) {
      let confimdata = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // console.log(confimdata)
      if (confimdata !== 'confirm') {
        return this.$message({
          message: '已取消删除',
          type: 'warning'
        });
      } else {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        // console.log(res)
        if (res.meta.status === 200) {
          // this.getdatas()
          role.children = res.data
          return this.$message({
            message: '删除成功',
            type: 'success'
          });
        } else {
          return this.$message.error('删除失败')
        }
      }
    },
    //分配权限
    async gettreedata(role) {
      this.roleid = role.id
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(role)
      this.treedata = res.data
      this.getkey(role, this.keys)
      // console.log(this.keys)
      this.dialogVisible = true
    },
    // 获得keys的id值
    getkey(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach((item) => {
          this.getkey(item, arr)
        })
      }
    },
    //修改key的值
    changekey() {
      this.keys = []
    },
    //添加权限
    async settreedata() {
      this.needdatas = [...this.$refs.treeref.getCheckedKeys(), ...this.$refs.treeref.getHalfCheckedKeys()]
      this.needdatas = this.needdatas.join(',')
      // console.log(this.needdatas)
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, { rids: this.needdatas })
      // console.log(res)
      if (res.meta.status === 200) {
        this.getdatas()
        this.dialogVisible = false
        return this.$message({
          message: '分配权限成功',
          type: 'success'
        });
      } else {
        this.getdatas()
        this.dialogVisible = false
        return this.$message.error('分配权限失败')
      }
    }
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

.topborder {
  border-top: 1px solid #eee;
}

.bottomborder {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  /* justify-content: center; */
  align-items: center;
}

.col {
  margin: 7px;
  font-size: 16px;
}
</style>