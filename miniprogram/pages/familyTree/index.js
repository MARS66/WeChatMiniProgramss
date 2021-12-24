let WxNotificationCenter = require('../../config/WxNotificationCenter.js');
let app = getApp();
let systemInfo = wx.getSystemInfoSync();
let windowWidth = systemInfo.windowWidth;
let windowHeight = systemInfo.windowHeight;
let fileSystemManager = wx.getFileSystemManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isiPhoneX: false,
    dataSource: null,
    windowWidth,
    showEmpty: false,
    width: 0,
    height: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {familyType}= wx.getStorageSync('user')
    wx.setNavigationBarTitle({title: familyType});
    this.setData({
      isiPhoneX: app.globalData.isiPhoneX,
    });
    ///添加点击节点的通知
    WxNotificationCenter.addNotification("NOTI_TREECLICK", this.itemClick, this);
  },
  onShow: function(){
    this.readData();
  },
  onUnload: function() {
    let that = this;
    ///移除通知
    WxNotificationCenter.removeNotification(NOTI_TREECLICK, that);
    WxNotificationCenter.removeNotification(NOTI_TREEEDIT, that);
  },
  ///节点点击
  itemClick: function({item,iswife}) {
    wx.navigateTo({
      url: `../detail/index?id=${item._id}&isWife=${iswife}`,
    })
  },
  ///读取数据
  readData: async function() {
    const {familyId}=wx.getStorageSync('user');
    const {result} = await wx.cloud.callFunction({
      name: 'get',
      data: {
        func: 'getFamliyTree',
        params:{familyId}
    },
      });
    if (result) {
      this.setData({dataSource:result,showEmpty:false})
    }else{
      this.setData({showEmpty:true})
    }
    if (this.data.dataSource) {
      let that = this;
      ///渲染完成后获取子组件大小重新设置宽高
      wx.createSelectorQuery().select('#rootTree').boundingClientRect(function(rect) {
        that.setData({
          width: rect.width > windowWidth ? rect.width : windowWidth,
          height: rect.height > windowHeight ? rect.height : windowHeight,
        })
      }).exec();
    }
  },
  toAddPerson(){
    wx.navigateTo({
      url: `../addPerson/index?pId=0`,
    })
  }
})