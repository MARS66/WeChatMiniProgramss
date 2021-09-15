// pages/product/index.js
import {getProduct} from '../../apis/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products:[],       
    tabs:['最新','最热'],
    currentIndex:0,
    num:10,
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
 async getdata() {
  const data= await getProduct({
    order:this.data.currentIndex,
    num:this.data.num,
    page:this.data.page,
  });
  this.setData({
    products:data.list,
  })
  },
  onLoad(){
    this.getdata();
  },
  // 更换tab
  changeTab({currentTarget:{dataset: {index}}}){
    this.setData({
      currentIndex:index,
    })
    this.getdata();
  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom () {
  const data= await getProduct({
    order:this.data.currentIndex,
    num:this.data.num,
    page:this.data.num+1,
  });
  this.setData({
    num:this.data.num,
    page:this.data.num+1,
    products:this.data.products.push(...data),
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})