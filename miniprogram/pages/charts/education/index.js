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
       func: 'getEducation',
       params:{familyId}
   },
   });
   wx.hideLoading();
   if (!result) {
     return;
   }
  var option = {
    tooltip: {
      show: true,
      formatter: "{b} : {c}人 占比{d}%"
    }, 
    title: {
      text: '教育水平',
      left: 'center',
      top:'10',
   },
    legend: {
      show: result.length>1,
      orient: 'horizontal',
      left: 'center',
      top:'60'
    },
    calculable: true,
    series: [{
      name: '教育水平',
      type: 'pie',
      center: ['50%', '50%'],
      radius: 80,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'outer',
            formatter:  "{b}: {d}%"
          },
          labelLine: {
            show: false
          }
        },
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
