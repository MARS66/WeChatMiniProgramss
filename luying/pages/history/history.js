// pages/collection/collection.js
import {historyOrFav0rites} from '../../apis/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showEmpty:false,
    customNavBarHeight:app.globalData.customNavBarHeight,
    products:[],
    num:10,
    page:1,
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata()
  },
  async getdata(page=1) {
    const data= await historyOrFav0rites({
      type:0,
      num:this.data.num*page,
      page:1,
    });
    this.setData({
      products:data.list.map(item=>item.jjgl),
      page,
      showEmpty:true,
      total:data.total
    })
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.page)*this.data.num<this.data.total)  this.getdata(this.data.page+1);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})