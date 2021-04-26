// pages/yiren/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    puyuan:[],
    sort: 0,
    familyType:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },
  transtionToDoubleArray: function(arr, colCount = 5) {
    const num = Math.ceil(arr.length / colCount);
    const temp = [];
    for (let i = 0; i < num; i += 1) {
      temp[i] = arr.slice(i * colCount, i * colCount + colCount);
    }
    const minu = colCount - temp[temp.length - 1].length;
    if (minu>0) {
      for (let i = 0; i < minu; i += 1) {
        temp[temp.length - 1].push({yiwen: '', hanwen: ''});
      }
    }
    return temp;
  },
  async init () {
    const {familyId,familyType}= wx.getStorageSync('user');
    const _id= wx.getStorageSync('userId');
    const {result} = await wx.cloud.callFunction({
      name: 'get',
      data: {
        func: 'getMyCard',
        params:{_id,familyId}
    },
    });
    if (result) {
      this.setData({
        puyuan: this.transtionToDoubleArray(result.puyuan),
        sort: result.sort,
        familyType,
      })
    }
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