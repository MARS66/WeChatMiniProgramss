import * as echarts from '../../../ec-canvas/echarts';

let chart = null;
  function  initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  return chart;
}

Page({
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
            name: '人数/人',
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
            data: ['学生','毕摩','苏尼','公务员','事业编','民企','国企','自主创业','务农人员','其他'],
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
