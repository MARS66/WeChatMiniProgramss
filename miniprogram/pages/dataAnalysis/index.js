const app = getApp();

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },
  data: {
    charts: [ {
      id: 'line',
      name: '人口分析'
    }, {
      id: 'gender',
      name: '男女比例'
    }, 
    {
      id: 'education',
      name: '教育水平'
    },{
      id: 'bar',
      name: '职业统计'
    }, 
     {
      id: 'radar',
      name: '综合竞争力'
    }, {
      id: 'map',
      name: '族人分布'
    }],
  },
  onReady() {
  },
  onLoad(){
    const {familyType}= wx.getStorageSync('user')
    wx.setNavigationBarTitle({
      title: `${familyType}家族`,
    })
  },
  open: function (e) {
    wx.navigateTo({
      url: '../charts/' + e.target.dataset.chart.id + '/index'
    });
  }
});
