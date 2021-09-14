// pages/about/about.js
import { getKF } from "../../apis/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    kfInfo:{
      kfdh:'13656566565',
      kfwx:'/static/images/scancode.png',
    },
    settings:[
      {
        text: '使用协议',
        url:'/pages/protocol/protocol'
      },
      {
        text:'关于我们',
        api:'gywm',
        url:'/pages/article/article'
      },
    ]
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.kfInfo.kfdh,
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