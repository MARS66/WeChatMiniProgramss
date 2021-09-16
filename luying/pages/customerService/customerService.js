// pages/customerService/customerService.js
import { getKF } from "../../apis/api";
import config from "../../config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:config.baseUrl,
    kfInfo:{
      kfdh:'13656566565',
      kfwx:'/static/images/scancode.png',
    }
  },
  // 打电话
  callPone(){
    wx.makePhoneCall({
      phoneNumber: this.data.kfInfo.kfdh //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
   const data = await getKF();
   this.setData({
    kfInfo:data||{},
   })
  },
})