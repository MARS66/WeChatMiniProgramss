// pages/mine/mine.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    list:[
      {
        icon:'/static/images/product.png',
        text:'我的产品',
        url:'/pages/myProduct/myProduct'
      },
      {
        icon:'/static/images/book.png',
        text:'我的预约',
        url:'/pages/booked/booked'
      },
      {
        icon:'/static/images/sc.png',
        text:'我的收藏',
        url:'/pages/collection/collection'
      },
      {
        icon:'/static/images/history.png',
        text: '我的足迹',
        url:'/pages/history/history'
      },
      {
        icon:'/static/images/kf.png',
        text:'我的客服',
        url:'pages/customerService/customerService'
      },
    ],
    settings:[
      {
        icon:'/static/images/set.png',
        text: '设置',
        url:'/pages/settings/settings'
      },
      {
        icon:'/static/images/about.png',
        text:'关于',
        url:'/pages/about/about'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  const vm=this;
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function({userInfo}) {
             vm.setData({
              userInfo,
             })
            }
          })
        }
      }
    })
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