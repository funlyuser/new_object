<template>
  <div class="report">
    <!-- 头部渲染 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div id="main" style="width:1200px;height:600px"></div>
    </el-card>
  </div>
</template>
<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },

  created() {

  },
  async mounted() {
    const { data: res } = await this.$http.get('reports/type/1')
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    //h合并数据
    const result = _.merge(this.options, res.data)
    // 绘制图表
    myChart.setOption(result);
  }
}
</script>
<style scoped>
.el-card {
  margin-top: 15px;
}
</style>