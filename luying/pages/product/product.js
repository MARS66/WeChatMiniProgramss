// pages/product/index.js
const app = getApp();
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
    total:0,
    customNavBarHeight:app.globalData.customNavBarHeight
  },
  onLoad(){
    this.getdata(1,true);
  },
  onShow(){
    this.getdata();
  },

 async getdata(page=1,loading=false) {
  const data= await getProduct({
    order:this.data.currentIndex,
    num:this.data.num*page,
    page:1,
  },loading);
  this.setData({
    products:data.list,
    page,
    total:data.total
  })
  },
  // 更换tab
  changeTab({currentTarget:{dataset: {index}}}){
    this.setData({
      currentIndex:index,
    })
    this.getdata(1,true);
  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.page)*this.data.num<this.data.total)  this.getdata(this.data.page+1,true);
  },
})