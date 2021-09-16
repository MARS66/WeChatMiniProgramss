// pages/reserve/reserve.js
import {bookProduct} from '../../apis/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:''
  },
  async formSubmit({detail:{value}}){
    if (!value.je|| !value.xm) {
      wx.showToast({
        title: '请先填写预约信息！',
        icon:'none'
      })
      return;
    }
    const res=await bookProduct({...value,id:this.data.id||'1'})
    if (res) {
      wx.navigateTo({
        url: '/pages/successful/successful',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({id}) {
    this.setData({id})
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