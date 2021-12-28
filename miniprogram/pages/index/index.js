// pages/index/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    gif:`${app.globalData.imgUrl}login.gif`
  },
  
  onLoad () {
    const {familyId} =wx.getStorageSync('user')
    if (familyId) {
      this.successFunc(familyId);
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
  },
  handleLoad(){
    this.setData({
      show:true,
    })
    wx.hideLoading()
  },
  checkForm(obj){
    return Object.keys(obj).find((key)=>!obj[key])
  },
  // 弹框提示
  showToast(title){
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  },
  // 提交
  formSubmit(e) {
    const vm=this;
    const key = this.checkForm(e.detail.value)
    if (key) {
     this.showToast(`${key==='familyType'?'家族':'邀请码'}不能为空!!`)
     return;
    }
    wx.showLoading();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'get',
      // 传给云函数的参数
      data: {
        func: 'joinOrCreated',
        coll:'family',
        params: e.detail.value,
      }}).then(({errMsg,result})=> {
        wx.hideLoading();
        if (errMsg!=="cloud.callFunction:ok" ) {
          vm.showToast('网络异常请稍后重试')
          return;
        }
        vm.successFunc(result)
      });
  },

  
  // 成功处理函数
  successFunc(result){
    wx.reLaunch({url: `../home/index?id=${result}` });
  }
})