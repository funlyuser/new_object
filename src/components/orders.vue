<template>
  <div class="orders">
    <!-- 头部渲染 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="inputval" class="input-with-select" clearable @change="seach"
            @clear="seach">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="seach">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="datas" style="width: 100%" border stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="400px">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price">
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <el-button type="primary" icon="el-icon-edit" circle @click="editdialog = true"></el-button>
          <el-button type="success" icon="el-icon-location" circle @click="getwuliu"></el-button>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 10, 15, 20]"
        :current-page="formdata.pagenum" :page-size="formdata.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 编辑dialog -->
    <el-dialog title="修改地址" :visible.sync="editdialog" width="30%" @close="resetdata">
      <el-form :model="addform" :rules="rules" ref="editFormref" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="addformarr">
          <el-cascader :options="city" v-model="addform.addformarr" clearable :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addformstr">
          <el-input v-model="addform.addformstr"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialog = false">取 消</el-button>
        <el-button type="primary" @click="editdialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流进度dialog -->
    <el-dialog title="物流进度" :visible.sync="dialogVisible" width="30%">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(item, index) in getwuliudata" :key="index" :timestamp="item.time">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import city from '../router/citydata'
export default {
  data() {
    return {
      inputval: '',
      formdata: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      datas: [],
      total: null,
      editdialog: false,
      city: city,
      addform: {
        addformarr: [],
        addformstr: ''
      },
      rules: {
        addformstr: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        addformarr: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      dialogVisible: false,
      getwuliudata: [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ]
    }
  },
  methods: {
    async getdatas() {
      const { data: res } = await this.$http.get('orders', { params: this.formdata })
      console.log(res)
      this.total = res.data.total
      this.datas = res.data.goods
      console.log(this.datas)
    },
    seach() {
      this.formdata = {
        query: this.inputval,
        pagenum: 1,
        pagesize: 10
      }
      this.getdatas()
      console.log(this.formdata.query)
    },
    handleSizeChange(val) {
      this.formdata.pagenum = 1
      this.formdata.pagesize = val
      this.getdatas()
    },
    handleCurrentChange(val) {
      this.formdata.pagenum = val
      this.getdatas()
    },
    resetdata() {
      this.$refs.editFormref.resetFields()
    },
    async getwuliu() {
      this.dialogVisible = true
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

.el-pagination {
  margin-top: 15px;
}

.el-input {
  margin-bottom: 15px;
}

.el-cascader {
  width: 100%;
}
</style>