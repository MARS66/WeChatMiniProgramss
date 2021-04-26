import * as echarts from '../../../ec-canvas/echarts';
let chart=null;
function initChart(canvas, width, height, dpr) {
   chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  wx.showLoading({
    title: '加载中...',
  })
  canvas.setChart(chart);
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

  onReady() {
    const _this=this
    setTimeout(function(){
      _this.getData();
    }, 2000);
  },
   /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh:async function () {
      wx.showNavigationBarLoading(); 
      await this.getData(); 
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
  },
  async getData(){
    const {familyId}= wx.getStorageSync('user');
    const {result} = await wx.cloud.callFunction({
      name: 'get',
      data: {
        func: 'getPopulation',
        params:{familyId}
    },
    });
    if (!result) {
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '加载数据失败，请下拉刷新！',
            icon:'none'
          })
        },
      })
      return;
    }
      wx.hideLoading();
      var option = {
        animationDuration: 3000,
        title: {
          text: '人口分析',
          top:'10',
          left: 'center'
        },
        color: ["#F5DF4D", "#67E0E3", "#F56C6C"],
        legend: {
          data: ['总人口', '出生', '死亡'],
          top: 30,
          left: 'center',
          z: 100
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          name: '时间段/年',
          boundaryGap: false,
          nameTextStyle:{
            fontStyle:"italic"
          },
          axisLabel: {
            interval:0,
            rotate:40
         },
         nameLocation:'center',
         nameGap:'50',
          data: result.xAxis,
          // show: false
        },
        yAxis: {
          x: 'center',
          name: '人数/人',
          nameLocation:'center',
          nameTextStyle:{
            fontStyle:"italic"
          },
          nameGap:'40',
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
          // show: false
        },
        series: [{
          name: '总人口',
          type: 'line',
          data:  result.total,
        }, {
          name: '出生',
          type: 'line',
          data:  result.born,
        }, {
          name: '死亡',
          type: 'line',
          data: result.death,
        }]
      };

      chart.setOption(option);
  }
});
