<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../image/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="back">退出</el-button>
    </el-header>
    <!-- 内容 -->
    <el-container>
      <!-- 左侧 -->
      <el-aside :width="boolean? '64px':'200px'">
        <div class="aside-button" @click="change" title="折叠" ref="btn">|||</div>
        <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
          active-text-color="#409BFF" :unique-opened="true" :collapse="boolean" :collapse-transition="false"
          :router="true" :default-active="defaultpath">
          <!-- 一级分组 -->
          <el-submenu :index="item.id+''" v-for="item in menus.data" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级分组 -->
            <el-menu-item-group>
              <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id">
                <i class="el-icon-menu"></i>
                <span>{{items.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      boolean: false,
      defaultpath: this.$router.currentRoute.fullPath,
      menus: [],
      icons: {
        125: 'el-icon-shopping-bag-2',
        103: 'el-icon-bank-card',
        101: 'el-icon-box',
        102: 'el-icon-sell',
        145: 'el-icon-shopping-bag-2',
      }
    }
  },
  methods: {
    async getdata() {
      const { data: res } = await this.$http.get('/menus')
      this.menus = res
      // console.log(this.menus)
    },
    back() {
      this.$router.push('/login')
      sessionStorage.removeItem('token')
    },
    change() {
      this.boolean = !this.boolean
      this.$refs.btn.title = this.boolean ? '取消折叠' : '折叠'
      console.log(this.$router.currentRoute.fullPath)
    }
  },
  created() {
    this.getdata()
  }
}
</script>
<style scoped>
.home {
  height: 100%;
}

.el-header div {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  padding-left: 10px;
  line-height: 100%;
  color: #fff;
}

.el-header div span {
  font-size: 24px;
  line-height: 100%;
  margin-left: 15px;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.el-aside {
  background-color: #333744;
  height: 100%;
  color: #fff;
}

.aside-button {
  background-color: #4a5064;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.3em;
  cursor: pointer;
}

.el-main {
  background-color: #EAEDF1;
  height: 100%;
}

.el-menu {
  color: #fff;
  border-right: none;
}
</style>