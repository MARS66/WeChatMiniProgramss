import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();
let chart='';
function initChart(canvas, width, height, dpr) {
   chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  wx.showLoading({
    title: '加载中...',
  })
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
  async  getData(){
    const {familyId}= wx.getStorageSync('user');
   const {result} = await wx.cloud.callFunction({
     name: 'get',
     data: {
       func: 'getGender',
       params:{familyId}
   },
   });
   wx.hideLoading();
   if (!result) {
     wx.showToast({
       title: '加载失败，请下拉刷新！',
       icon:'none',
     })
     return;
   }
  var option = {
    tooltip: {
      show: true,
      formatter: "{b} : {c}人 占比{d}%"
    }, 
    title: {
      text: '男女比例',
      left: 'center',
      top:'10',
   },
    legend: {
      show: result.length>1,
      orient: 'horizontal',
      left: 'center',
      top:'40'
    },
    color: ['#56cbff', '#ff6300'],
    calculable: true,
    series: [{
      name: '男女比例',
      type: 'pie',
      center: ['50%', '50%'],
      radius: 80,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'inner',
            formatter: function(params) {
              return (params.percent - 0).toFixed(0) + '%'
            }
          },
          labelLine: {
            show: false
          }
        },
        emphasis: {
          label: {
            show: true,
            formatter: "{b}\n{d}%"
          }
        }
      },
      data: result,
    }]
  };
  chart.setOption(option);
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
  }

});
