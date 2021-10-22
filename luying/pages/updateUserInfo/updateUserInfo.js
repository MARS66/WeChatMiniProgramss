// pages/userInfo/userInfo.js
import {getUserInfo,updateUserInfo} from '../../apis/api';
import config from '../../config';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customNavBarHeight:app.globalData.customNavBarHeight,
    baseUrl:config.baseUrl,
    userInfo:{

    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const  res= await getUserInfo()
    if (res) {
      this.setData({
        userInfo:res
      })
    }
  },

  chooseImg(){
    const vm=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        vm.upload(vm,tempFilePaths)
      }
    })
  },
//  上传照片
upload(page, path) {
  wx.showToast({
  icon: "loading",
  title: "正在上传"
  }),
  wx.uploadFile({
  url: config.baseUrl + "/api/common/upload",
  filePath: path[0], 
  name: 'file',
  header:{
    token:wx.getStorageSync('token')
  },
  success: function (res) {
    const data=JSON.parse(res.data)
  if (res.statusCode != 200||data.code!==1) { 
   wx.showModal({
    title: '提示',
    content: '上传失败',
    showCancel: false
    })
   return;
  }
  //上传成功修改显示头像
  page.setData({ 
   'userInfo.avatar': data.data.url
  })
  },
  fail: function (e) {
    wx.showModal({
    title: '提示',
    content: '上传失败',
    showCancel: false
    })
  },
  complete: function () {
     wx.hideToast(); //隐藏Toast
  }
  })
},
async formSubmit({detail:{value}}){
  value.gender=parseInt(value.gender,10);
  const res=await updateUserInfo(value);
  if (res) {
    wx.showToast({
      title: '保存成功',
      icon:'success'
    })
    wx.navigateBack({
      delta: 1,
    })
  }
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