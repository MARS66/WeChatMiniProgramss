// pages/news/news.js
const app = getApp();
import { getNews } from "../../apis/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:[],       
    tabs:['最新','最热'],
    currentIndex:0,
    num:10,
    page:1,
    total:0,
    customNavBarHeight:app.globalData.customNavBarHeight
  },
 // 更换tab
 changeTab({currentTarget:{dataset: {index}}}){
  this.setData({
    currentIndex:index,
  })
  this.getdata(1,true);
},

onLoad: function (options) {
  this.getdata(1,true);
},
  /**
   * 生命周期函数--监听页面加载
   */
onShow: function (options) {
  this.getdata();
},
  async getdata(page=1,loading=false) {
    const data= await getNews({
      order:this.data.currentIndex,
      num:this.data.num*page,
      page:1,
    },loading);
    this.setData({
      news:data.list,
      page,
      total:data.total
    })
  },
  
  onReachBottom: function () {
    if ((this.data.page)*this.data.num<this.data.total)  this.getdata(this.data.page+1,true);
  },
})