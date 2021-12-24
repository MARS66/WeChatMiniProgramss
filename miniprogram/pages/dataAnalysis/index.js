const app = getApp();

Page({
  data: {
    charts: [  {
      id: 'gender',
      name: '男女比例'
    }, {
      id: 'line',
      name: '人口分析'
    },
    {
      id: 'education',
      name: '教育水平'
    },{
      id: 'bar',
      name: '职业统计'
    }, {
      id: 'map',
      name: '族人分布'
    }],
  },
  onLoad(){
    const {familyType}= wx.getStorageSync('user')
    wx.setNavigationBarTitle({title: familyType});
  },
  open: function (e) {
    wx.navigateTo({
      url: '../charts/' + e.target.dataset.chart.id + '/index'
    });
  }
});
