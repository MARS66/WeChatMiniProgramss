// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:[
      {
        text:'合法化覅和撒酒疯和i啊的繁华放大时间和',
        img:'../../static/images/图层 25.png',
        reads:'1561'
      },
      {
        text:'合法化覅和撒酒疯和i啊的繁华放大时间和',
        img:'../../static/images/图层 25.png',
        reads:'1561'
      },
    ],       
    tabs:['最新','最热'],
    currentIndex:0,
  },
 // 更换tab
 changeTab({currentTarget:{dataset: {index}}}){
  this.setData({
    currentIndex:index,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})