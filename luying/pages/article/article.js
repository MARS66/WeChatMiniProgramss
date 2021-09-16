// pages/article/article.js
import { getArticle,getNewsDetail } from "../../apis/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    node:'',
    articleTitle:'',
    time:'',
    titles:{
      gywm:'关于我们',
      syxy:'使用协议',
      yszc:'隐私政策',
      fkcs:'风控措施',
      hkly:'还款来源',
      zxxq:'资讯详情',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad ({api,node,id='1'}) {
  const vm =this;
   this.setData({title:vm.data.titles[api]})
   if (id) {
    const data =await getNewsDetail(id)
    console.log(data);
    this.setData({
      node:data.content,
      articleTitle:data.title,
      time:data.createtime_text,
    })
     return;
   }
   if (node) {
    this.setData({node,});
    return;
   }
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