// app.js
import { wxlogin } from "./apis/api";
App({
  onLaunch() {
    const vm=this;
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
   // 登录
   wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      vm.login(res.code)
    }
  })

    // 自定义导航栏
    wx.getSystemInfo({
     success: e => {
       //状态栏
       let statusBarHeight= e.statusBarHeight;
       // 右上角胶囊
       let menuButton = wx.getMenuButtonBoundingClientRect();
       //胶囊宽度加上左右边距的新宽度【即自定义导航栏时，左边元素的margin-right的值】
       menuButton.extendWidth=menuButton.width+2*(e.windowWidth-menuButton.right);
       menuButton.marginRight=e.windowWidth-menuButton.right;//胶囊的右边距。用于设置返回的左边距。对称
       // 保存
       this.globalData.customNavBarHeight= menuButton.bottom + menuButton.top - statusBarHeight;
       this.globalData.customTextHight= menuButton.height;
       this.globalData.customTextpadding=this.globalData.customNavBarHeight - menuButton.bottom;

     }
   })
  },
  
  async login(code){
    const res=await wxlogin(code)
    // 第三方登录请求获取token本地存储
    wx.setStorageSync('token', res?.userinfo?.token)
  },
  globalData: {
    customTextHight:null,
    customTextpadding:null,
    customNavBarHeight:null,//自定义导航栏的高度【导航栏包括了状态栏】
  }
})
