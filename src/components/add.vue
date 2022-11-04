<template>
  <div class="add">
    <!-- 头部渲染 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false">
      </el-alert>
      <!-- steps模块 -->
      <el-steps :active="step - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs模块 -->
      <el-form :label-position="'top'" label-width="80px" :model="addformdata" :rules="rules" ref="addformref">
        <el-tabs :tab-position="'left'" v-model="step" :before-leave="changetabs" @tab-click="changeclick">
          <el-tab-pane label="基本信息" name="0">
            <el-alert title="商品分类为必选项且只能是三级分类" type="warning" center show-icon width="200px">
            </el-alert>
            <el-form-item label="商品分类">
              <el-cascader v-model="addformdata.goods_cat" :options="options"
                :props="{ expandTrigger: 'hover', ...propsdata }" @change="handleChange" clearable style="width: 20%">
              </el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addformdata.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addformdata.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addformdata.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addformdata.goods_number" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label=" 商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manynumlist" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" border v-for="item1 in item.attr_vals" :key="item1.index">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlynumlist" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload-demo" action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="picval"
              :on-success="handlesuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-dialog title="图片预览" :visible.sync="picdialog" width="50%">
              <hr>
              <img :src="picimg" alt="">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addformdata.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addval" style="margin-top: 15px;">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    var weight = (rule, value, callback) => {
      if (value === '') callback('请输入重量')
      if (typeof (value) !== 'number') {
        callback('必须是数字')
      } else if (value <= 0) {
        callback('重量不能小于等于0')
      }
    }
    var price = (rule, value, callback) => {
      if (value === '') callback('请输入价格')
      if (typeof (value) !== 'number') {
        callback('必须是数字')
      } else if (value <= 0) {
        callback('价格不能小于等于0')
      }
    }
    var number = (rule, value, callback) => {
      if (value === '') callback('请输入数量')
      if (typeof (value) !== 'number') {
        callback('必须是数字')
      } else if (value <= 0) {
        callback('数量不能小于等于0')
      }
    }
    return {
      step: '0',
      propsdata: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      options: [],
      addformdata: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: []
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        goods_price: [
          // { validator: price, trigger: 'blur' }
          { required: true, message: '请输入物品价格', trigger: 'blur' },
          { type: 'number', message: '必须是数字类型', trigger: 'blur' }
        ],
        goods_weight: [
          // { validator: weight, trigger: 'blur' }
          { required: true, message: '请输入物品重量', trigger: 'blur' },
          { type: 'number', message: '必须是数字类型', trigger: 'blur' }
        ],
        goods_number: [
          // { validator: number, trigger: 'blur' },
          { required: true, message: '请输入物品数量', trigger: 'blur' },
          { type: 'number', message: '必须是数字类型', trigger: 'blur' }
        ]
      },
      manynumlist: [],
      onlynumlist: [],
      //图片上传
      picval: {
        authorization: sessionStorage.getItem('token')
      },
      picdialog: false,
      picimg: '',
      //添加
      newaddformdata: {}
    }
  },
  methods: {
    async getoption() {
      const { data: res } = await this.$http.get('/categories')
      console.log(res)
      this.options = res.data
    },
    handleChange() {
      console.log(this.addformdata.goods_cat)
      if (this.addformdata.goods_cat.length !== 3) {
        this.addformdata.goods_cat = []
      }
    },
    changetabs() {
      // console.log(11)
      if (this.addformdata.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async changeclick() {
      console.log(this.step)
      if (this.step === '1') {
        const { data: res } = await this.$http.get(`categories/${this.addformdata.goods_cat[2]}/attributes`, { params: { sel: 'many' } })
        console.log(res)
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.manynumlist = res.data


      } else if (this.step === '2') {
        const { data: res } = await this.$http.get(`categories/${this.addformdata.goods_cat[2]}/attributes`, { params: { sel: 'only' } })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.onlynumlist = res.data

      }
    },
    handlesuccess(response) {
      const res = { 'pic': response.data.tmp_path }
      this.addformdata.pics.push(res)
    },
    handleRemove(file) {
      const i = this.addformdata.pics.findIndex(x => {
        x.pic === file.response.tmp_path
      })
      this.addformdata.pics.splice(i, 1)
    },
    handlePreview(file) {
      this.picdialog = true
      // console.log(file)
      this.picimg = file.response.data.url
    },
    async addval() {
      this.$refs.addformref.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单')
        }
        this.deepclone(this.newaddformdata, this.addformdata)
        this.newaddformdata.goods_cat = this.newaddformdata.goods_cat.join(',')
        console.log(this.newaddformdata)
        const { data: res } = await this.$http.post('/goods', this.newaddformdata)
        console.log(res)
        this.$router.push('/goods')
        if (res.meta.status === 201) {
          return this.$message.success('添加成功')
        } else {
          return this.$message.error('添加失败')
        }
      });
    },
    deepclone(newval, oldval,) {
      for (var k in oldval) {
        let item = oldval[k]
        if (item instanceof Array) {
          newval[k] = []
          this.deepclone(newval[k], item)
        } else if (item instanceof Object) {
          newval[k] = {}
          this.deepclone(newval[k], item)
        } else {
          newval[k] = item
        }
      }
    }
  },
  created() {
    this.getoption()
  },
}
</script>
<style scoped>
.el-card,
.el-steps,
.el-tabs {
  margin-top: 15px;
}

.el-checkbox {
  margin: 10px
}

img {
  /* margin: 15px; */
  width: 100%;
}
</style>