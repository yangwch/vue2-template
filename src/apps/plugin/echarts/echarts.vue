<template>
  <div class="echartBox">
    <div :id="echartData.byId" style="width:100%; height:250px;"></div>				
  </div>
</template>
<script>
  import echarts from "echarts"
  export default {
    props: {
      echartData: {
        type: Object,
        default: function() {
          return {
            byId: '',
            type: ''
          }
        },
        required: true
      }
    },
    data() {
      return {
        echartInfo: null,
        setOption: {},
        title: {
          show: true,
          text: '',
          top: 5,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            // color: '#fff'
          }
        },
        /*  图表组件标记 */ 
        legend: {
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            // color: '#fff'
          },
          data: []
        },
        /*  组件坐标系网格位置 */ 
        grid: {
          left: '2%',
          right: '3%',
          bottom: 20,
          top: 100,
          containLabel: true
        },
        /*  X轴 */ 
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisLine: {
            lineStyle: {
              // color: '#fff'
            }
          },
          axisTick: {
            // 是否显示坐标轴刻度
            show: false
          },
          axisLabel: {
            interval: 0
          }
        },
        /*  Y轴 */ 
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              // color: '#fff'
            }
          },
          splitLine: {
            // 是否显示分隔线。默认数值轴显示，类目轴不显示
            show: false
          },
          axisTick: {
            // 是否显示坐标轴刻度
            show: false
          }
        },
        /*  提示 */ 
        tooltip: {
          trigger: 'axis',
        },
        /*  饼状图填充颜色 */ 
        color: ['#b6a2de', '#2ec7c9', '#e8a975', '#d77a7f', '#5ab1ef'],
        series: [{
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '55%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: '',
              textStyle: {
                // color: '#fff'
              }
            },
            emphasis: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            normal: {
              show: true,
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 5,
              length2: 10
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: []
        },
        {
          name: '',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 12,
                  lineHeight: 24
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 2,
              length2: 5
            }
          },
          data: []
        }]
      }
    },
    created() {
      if (this.echartData.title) {
        /*  title属性 */ 
        if (this.echartData.title.show) {
          this.title.show = this.echartData.title.show
        }
        if (this.echartData.title.text) {
          this.title.text = this.echartData.title.text
        }
        if (this.echartData.title.top) {
          this.title.text = this.echartData.title.top
        }
        if (this.echartData.title.textStyle && this.echartData.title.textStyle.fontSize) {
          this.title.textStyle.fontSize = this.echartData.title.textStyle.fontSize
        }
      }
      if (this.echartData.legend && this.echartData.legend.data) {
        this.legend.data = this.echartData.legend.data
      }
      if (this.echartData.type == 'pie') {
        /*  图表组件标记 */ 
        this.legend.orient = 'vertical'
        this.legend.x = 'left'
        /*  提示 */ 
        this.tooltip = {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        }
        /*  饼状图填充颜色 */ 
        if (this.echartData.color) {
          this.color = this.echartData.color
        }
        /*  series参数设置 */ 
        if (this.echartData.series[0]) {
          if (this.echartData.series[0].name) {
            this.series[0].name = this.echartData.series[0].name
          }
          if (this.echartData.series[0].radius) {
            this.series[0].radius = this.echartData.series[0].radius
          }
          if (this.echartData.series[0].center) {
            this.series[0].center = this.echartData.series[0].center
          }
          if (this.echartData.series[0].label && this.echartData.series[0].label.normal && this.echartData.series[0].label.normal.position) {
            this.series[0].label.normal.position = this.echartData.series[0].label.normal.position
          }
          if (this.echartData.series[0].data) {
            this.series[0].data = this.echartData.series[0].data
          }
        }
        if (this.echartData.series[1]) {
          if (this.echartData.series[1].name) {
            this.series[1].name = this.echartData.series[1].name
          }
          if (this.echartData.series[1].radius) {
            this.series[1].radius = this.echartData.series[1].radius
          }
          if (this.echartData.series[1].center) {
            this.series[1].center = this.echartData.series[1].center
          }
          if (this.echartData.series[1].label && this.echartData.series[1].label.emphasis) {
            this.series[1].label.emphasis = this.echartData.series[1].label.emphasis
          }
          if (this.echartData.series[1].data) {
            this.series[1].data = this.echartData.series[1].data
          }
        }
        /*  参数设置 */ 
        this.setOption = {
          title: this.title,
          legend: this.legend,
          tooltip: this.tooltip,
          color: this.color,
          series: this.series
        }
      } else if (this.echartData.type == 'line') {
        /*  图表组件标记 */ 
        this.legend.top = 40
        /*  X轴 */ 
        if (this.echartData.xAxis && this.echartData.xAxis.data) {
          this.xAxis.data = this.echartData.xAxis.data
        }
        this.xAxis.boundaryGap = false
        if (this.echartData.series) {
          this.series = this.echartData.series
        }
        this.setOption = {
          title: this.title,
          legend: this.legend,
          tooltip: this.tooltip,
          grid: this.grid,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: this.series
        }
      } else if (this.echartData.type == 'bar') {
        /*  提示 */ 
        this.tooltip.axisPointer = {  // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'  // 默认为直线，可选为：'line' | 'shadow'
        }
        this.legend.top = 40
        if (this.echartData.grid) {
          if (this.echartData.grid.top) {
            this.grid.top = this.echartData.grid.top
          }
          if (this.echartData.grid.bottom) {
            this.grid.bottom = this.echartData.grid.bottom
          }
        }
        /*  X轴 */ 
        if (this.echartData.xAxis && this.echartData.xAxis.data) {
          this.xAxis.data = this.echartData.xAxis.data
        }
        if (this.echartData.series) {
          this.series = this.echartData.series
        }
        this.setOption = {
          title: this.title,
          legend: this.legend,
          tooltip: this.tooltip,
          grid: this.grid,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: this.series
        }
      }
    },
    mounted() {
      this.piecustomInfo()
    },
    methods: {
      /*  获取图表 */ 
      piecustomInfo() {
        const self = this;
        self.echartInfo = echarts.init(document.getElementById(self.echartData.byId));
        self.echartInfo.setOption(self.setOption)
      }
    },
  }
</script>