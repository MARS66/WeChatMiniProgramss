// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    default: '../../static/img/girl.jpg',
    openId:'',
    familyType:'',
    isBind: false,
    userInfo:{},
    auth:[
      [
        {name:'彝族身份',page:'yiren',img:'../../static/icon/minzu.png'},
        {name:'个人信息',page:'detail',img:'../../static/icon/IDCard.png'},
        {name:'角色绑定',page:'search',img:'../../static/icon/bind.png'},
      ],
      [
        {name:'编辑个人',page:'addPerson',img:'../../static/icon/edit.png'},
        {name:'编辑家族',page:'familyInfo',img:'../../static/icon/editF.png'},
        {name:'操作日志',page:'log',img:'../../static/icon/oprea.png'},
      ],
      [
        {name:'问题反馈',page:'problem',img:'../../static/icon/res.png'},
        {name:'退出',page:'index',img:'../../static/icon/exit.png'},
        {name:'帮助',page:'help',img:'../../static/icon/help.png'},
      ]
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {familyType}= wx.getStorageSync('user')
    this.setData({
      imgUrl: `${getApp().globalData.imgUrl}bacImg.jpg`,
    })
    wx.setNavigationBarTitle({
      title: `${familyType}家族`,
    })
  },
  issue(e){  
    const {isView}=wx.getStorageSync('user');
    const auth = ['familyInfo','addPerson','yiren','detail'];
    const {page} = e.currentTarget.dataset;
    if (isView&&page!=='help'&&page!=='index') {
      wx.showToast({
        title: '预览不支持此操作，更多功能请登录!',
        icon:'none',
      });
      return;
  }
    if (page==='problem') {
      return
    }
    if (!this.data.isBind&&auth.includes(page)) {
      wx.showToast({
        title: '请先绑定角色',
        icon: 'none',
      })
      return;
    }
    if (page==='index') {
      wx.clearStorageSync();
      wx.reLaunch({
        url: `../${page}/index?id=${this.data.userInfo._id}`,
      })
      return;
    }
    wx.navigateTo({
      url: `../${page}/index?id=${this.data.userInfo._id}`,
    })
  },
  viewImage(){
    wx.previewImage({
      urls: [this.data.userInfo.avatar]
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
  onShow: async function () {
    const{familyId,familyType}= wx.getStorageSync('user');
    const {result} = await wx.cloud.callFunction({name: 'get',data: {func: 'getOpenid'}});
    const db =wx.cloud.database();
    const{data} =await db.collection('user').where({familyId,bindId:result}).get();
    if (data.length>0) {
      wx.setStorageSync('userId', data[0]._id);
      this.setData({
        familyType,
        userInfo:data[0],
        isBind: true,
      })
    }
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