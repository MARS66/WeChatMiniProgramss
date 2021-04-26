// import * as echarts from '../../../ec-canvas/echarts';
const echarts = require('../../../ec-canvas/echarts');

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#F5DF4D"],
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    radar: {
      // shape: 'circle',
      indicator: [{
        name: '教育',
        max: 1
      },
      {
        name: '人口',
        max: 1
      },
      {
        name: '就业',
        max: 1
      },
      {
        name: '毕摩',
        max: 20
      },
      {
        name: '苏尼',
        max: 20
      },
      ]
    },
    series: [{
      name: '预算 vs 开销',
      type: 'radar',
      smooth: true,
      data: [{
        value: [0.8, 0.7, 0.9, 16, 2],
        name: '综合'
      },
      ]
    }]
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

  onReady() {
  }
});
