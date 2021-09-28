// pages/mine/mine.js
import {getUserInfo} from '../../apis/api'
import config from '../../config'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customNavBarHeight:app.globalData.customNavBarHeight,
    baseUrl:config.baseUrl,
    userInfo:'',
    list:[
      {
        icon:'/static/images/product.png',
        text:'我的产品',
        url:'/pages/myProduct/myProduct'
      },
      {
        icon:'/static/images/book.png',
        text:'我的预约',
        url:'/pages/booked/booked'
      },
      {
        icon:'/static/images/sc.png',
        text:'我的收藏',
        url:'/pages/collection/collection'
      },
      {
        icon:'/static/images/history.png',
        text: '我的足迹',
        url:'/pages/history/history'
      },
      {
        icon:'/static/images/kf.png',
        text:'我的客服',
        url:'/pages/customerService/customerService'
      },
    ],
    settings:[
      {
        icon:'/static/images/set.png',
        text: '设置',
        url:'/pages/settings/settings'
      },
      {
        icon:'/static/images/about.png',
        text:'关于',
        url:'/pages/about/about'
      },
    ]
  },
 /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    const  res= await getUserInfo(true)
    this.setData({
      userInfo:res
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onShow (options) {
    const  res= await getUserInfo(false)
    this.setData({
      userInfo:res
    })
  },
})