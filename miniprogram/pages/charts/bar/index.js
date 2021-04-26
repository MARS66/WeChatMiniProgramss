import * as echarts from '../../../ec-canvas/echarts';

let chart = null;
  function  initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  wx.showLoading({
    title: '加载中...',
  })
  wx.showNavigationBarLoading(); 
  var option = {
    animationDuration: 2000,
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    title:{
      text:'职业统计',
      left: 'center',
      top: 10,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 60,
      top: 60,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        name: '认数/人',
        boundaryGap: false,
        nameTextStyle:{
          fontStyle:"italic"
        },
        axisLabel: {
          interval:0,
          rotate:40
        },
        nameLocation:'center',
        nameGap:'40',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        name: '职业类别',
        nameTextStyle:{
          fontStyle:"italic"
        },
        axisTick: { show: false },
        data: ['学生','教师','医生','警察','毕摩','苏尼','务农','公务员','事业单位','私企职员','国企职员','自由职业','自主创业'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
          }
        },
        data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
    ]
  };
  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  async  getbar(){
    const {familyId}= wx.getStorageSync('user');
   const {result} = await wx.cloud.callFunction({
     name: 'get',
     data: {
       func: 'getbar',
       params:{familyId}
   },
   });
   return result;
 },
  async showData(){
    const result=await this.getbar();
    wx.hideLoading()
    wx.hideNavigationBarLoading();
      var option = {
        color: ['#37a2da', '#32c5e9', '#67e0e3'],
        title:{
          text:'职业统计',
          left: 'center',
          top: 10,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 60,
          top: 60,
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            name: '认数/人',
            boundaryGap: false,
            nameTextStyle:{
              fontStyle:"italic"
            },
            axisLabel: {
              interval:0,
              rotate:40
            },
            nameLocation:'center',
            nameGap:'40',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              color: '#666'
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: ['学生','教师','医生','毕摩','苏尼','公务员','事业单位','私企职员','国企职员','自由职业','其他职业'],
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              color: '#666'
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true
              }
            },
            data: result,
            itemStyle: {
              // emphasis: {
              //   color: '#32c5e9'
              // }
            }
          },
        ]
      };
      chart.setOption(option);
  },
  onReady() {
    const _this=this
    setTimeout(function(){
      _this.showData();
    }, 2000);
  },
   /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh:async function () {
      wx.showNavigationBarLoading(); 
      await this.showData(); 
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
  }
});
