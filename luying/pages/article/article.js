// pages/article/article.js
import { getArticle } from "../../apis/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    node:'',
    titles:{
      gywm:'关于我们',
      syxy:'使用协议',
      yszc:'隐私政策',
      fkcs:'风控措施',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad ({api}) {
  const vm =this;
   this.setData({title:vm.data.titles[api]})
   const data = await getArticle(api)
   this.setData({node:data[api] })
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