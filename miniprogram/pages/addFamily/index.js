// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: '../../static/img/suni.jpg',
  },
  comeBack(){
    wx.navigateBack({
      delta: 1,
    })
  },
  async formSubmit(e) {
    const  {familyType,code} = e.detail.value;
    if (familyType==="") {
      wx.showToast({
        title: '家族名称不能为空',
        icon: 'none',
        duration: 2000
      })
     return;
    }
    if (code==="") {
      wx.showToast({
        title: '邀请码不能为空',
        icon: 'none',
        duration: 2000
      })
     return;
    }
    wx.showLoading({title: '', })
    const db = wx.cloud.database();
     const {data} = await db.collection('family').where({familyType}).get();
     if (data.length>0) {
       wx.hideLoading({
         success: (res) => {
          wx.showToast({
            title: '家族已被注册',
            icon: 'none',
            duration: 2000
          })},
       })
     return;
     }
   const {result:{OPENID}}= await  wx.cloud.callFunction({name: 'get',data: {func: 'getOpenid',}})
    this.addFamily(familyType,code,OPENID)
  },
  addFamily(familyType,code,OPENID){
    const db = wx.cloud.database();
    db.collection('family')
    .add({data:{familyType,code,creater:OPENID}}).then((res)=>{
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: `成功创建${familyType}`,
              icon: 'success',
              duration: 2000,
              success:()=>{
                wx.navigateTo({
                  url: `../index/index?code=${code}&familyType=${familyType}`,
              });
              }
            });
          },
        })   
      }); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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