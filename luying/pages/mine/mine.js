// pages/mine/mine.js
import {getUserInfo,updateUserInfo} from '../../apis/api'
import config from '../../config'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unlogin:false,
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
    ],
  },
 /**
   * 生命周期函数--监听页面加载
   */
onLoad (options) {
   this.getInfo()
  },
  async getInfo(loading=true){
    const  res= await getUserInfo(loading)
    if (!res.is_login) {
      this.setData({
        userInfo:res,
        unlogin:true
      })
    } else {
      this.setData({
        userInfo:res,
        unlogin:false
      })
    }
  },
  cancel(){
    this.setData(
      {
        unlogin:false,
      }
    )
  },

  getwxifo(){
    this.setData({
      unlogin:false,
    })
    const vm=this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
       vm.getUserInfo(res.userInfo)
      },
    })  
  },
  async getUserInfo(userInfo) {
    const vm=this;
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    wx.showLoading({
      title: '拼命加载中...',
    })
    wx.getImageInfo({
      src:userInfo.avatarUrl,
      success (sres) {
        wx.uploadFile({
          url: config.baseUrl + "/api/common/upload",
          filePath: sres.path, 
          name: 'file',
          header:{
            token:wx.getStorageSync('token')
          },
          success: function (res) {
            const {data}=JSON.parse(res.data)
            vm.updateUserInfo({
              nickname:userInfo.nickName,
              gender:userInfo.gender,
              avatar:data.url,
            })
          },
          fail (e) {
            wx.hideLoading();
            wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
            })}
          });
       }
    });
  },
  
  async updateUserInfo(data){
    await updateUserInfo(data);
    await this.getInfo(false);
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onShow (options) {
   this.getInfo()
  },
})