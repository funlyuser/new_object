<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="login_header">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form class="login_form" :model="info" :rules="rules" ref="formdata">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="info.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-s-goods" v-model="info.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submit">登录</el-button>
          <el-button type="info" @click="reset(info)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.formdata.validate(async (boolean) => {
        if (!boolean) { return }
        else {
          const { data: res } = await this.$http.post('login', this.info)
          if (res.meta.status == 200) {
            this.$message({
              message: '恭喜你，登录成功',
              type: 'success'
            });
            sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            return this.$message.error('登录失败，账号或密码错误');
          }
        }
      })
    },
    reset() {
      this.$refs.formdata.resetFields()
    },
  }
}
</script>
<style  scoped>
.login {
  background-color: lightcoral;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login_header {
  height: 130px;
  width: 130px;
  background-color: #fff;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #ddd;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 10px #ddd;
}

.login_header img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #ddd;
}

.login_form {
  position: absolute;
  bottom: 0;
  margin-left: 10%;
  width: 80%;
}

.btns {
  display: flex;
  justify-content: flex-end;
  padding-right: 0px;
}
</style>