// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: '../../static/img/bimo.jpg',
    code:'',
    familyType:'',
  },
  changeValue(e){
    const {type}=  e.currentTarget.dataset;
    const {value}= e.detail;
    this.setData({
      [type]:value
    })
  },
  view(){
    wx.setStorageSync('user', 
    {code:'yulan123.',familyType:'预览',isView:true, logo:'', creater:'oQyYL41JSZGKT6kHIchG2mcxbLEM',familyId: '1526e12a601e378e025f51fa3a427818'});
    wx.reLaunch({
      url: '../home/index'
      });
  },
  formSubmit(e) {
    const  {familyType,code} = e.detail.value;
    if (familyType==="") {
      wx.showToast({
        title: '请输先入家族名称',
        icon: 'none',
        duration: 2000
      })
     return;
    }
    if (code==="") {
      wx.showToast({
        title: '请先输入邀请码',
        icon: 'none',
        duration: 2000
      })
     return;
    }
    wx.showLoading();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'get',
      // 传给云函数的参数
      data: {
        func: 'joinFamily',
        coll:'family',
        params: {familyType},
      }}).then(({errMsg,result:{data}})=> {
        if (errMsg!=="cloud.callFunction:ok" ) {
          wx.hideKeyboard({
            success: (res) => {
              wx.showToast({
                title: '网络错误请稍后重试',
                icon: 'none',
                duration: 2000
              });
            },
          })
          return;
        }
        if (!data||data.length<1) {
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: `暂无${familyType}家族，请核对或新建!`,
                icon: 'none',
                duration: 2000
              });
            },
          })
          return;
        }
        if (data[0].code!==code && data[0].familyType===familyType) {
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: `邀请码错误!`,
                icon: 'none',
                duration: 2000
              });},
          })
          return;
        }
        if (data[0].code===code &&data[0].familyType===familyType) {
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: `成功加入${familyType}`,
                icon: 'success',
                duration: 2000,
                success:()=>{
                  wx.setStorageSync('user', 
                  {code,familyType,logo:data[0].logo, creater:data[0].creater,familyId: data[0]._id});
                  wx.reLaunch({
                    url: '../home/index'
                    });
                }
              });
            },
          })      
        } 
      }).catch(console.error);
  },
  toAddF(){
    wx.navigateTo({
      url: '../addFamily/index',
})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {familyId}= wx.getStorageSync('user')
    if (familyId) {
      wx.reLaunch({
        url: '../home/index'
        });
      return;
    }
   const { code,familyType}=options;
   if (familyType) {
    this.setData({
      code,
      familyType,
    })
   }
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
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