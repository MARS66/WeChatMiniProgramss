// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    keyword:'',
    result:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {familyId}=wx.getStorageSync('user');
    const {result} = await wx.cloud.callFunction({name: 'get',data: {func: 'getFamilyList',params:{familyId}},});
   this.setData({
    list:result,
    familyId,
    imgUrl: `${getApp().globalData.imgUrl}search.jpg`});
  },
  toAddPerson(){
    wx.navigateTo({
      url: `../addPerson/index?pId=0`,
    })
  },
  async search(){
    if (this.data.keyword) {
      wx.showLoading({
        title: '正在查询...',
      })
      const {result} = await wx.cloud.callFunction({name: 'get',data: {func: 'search',params:{keyword:this.data.keyword,familyId:this.data.familyId}}});
     wx.hideLoading({});
      if (result.length>0) {
      this.setData({result,})
      return;
     }
     wx.showToast({
      title: `暂无${this.data.keyword}相关家族成员`,
      icon: 'none',
      duration: 2000
    })
      return;
    }
    wx.showToast({
      title: '请输入关键字查询',
      icon: 'none',
      duration: 2000
    })
  },
  setKeywords(e){
      this.setData({keyword:e.detail.value})
  },
  // 去当前点击这个人的详情页
  goHisDetail(e){
    const {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../detail/index?id=${id}`,
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