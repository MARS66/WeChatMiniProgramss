// pages/detail/detail.js
import {getProductDetail,collectPoduct} from '../../apis/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customNavBarHeight:app.globalData.customNavBarHeight,
    details:{},
    isMine:false,
    hiddenTJ:false,//是否显示推荐
    support:['doc','docx','xls','xlsx','ppt','pptx','pdf']
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
 onLoad({id,hiddenTJ,api}) {
   this.setData({
    hiddenTJ,
    isMine:api,
   })
  this.getDetail(id,api);
},
  async getDetail(id,api){
    const details=await getProductDetail(id,api);
    Object.assign(details,(details?.jjgl??{}))
    this.setData({
      details:details,
    })
  },
  async collectPoduct(){
   await collectPoduct(this.data.details.id);
   this.getDetail(this.data.details.id);
  },
  downloadFile({currentTarget:{dataset: {src}}}){
    const arr= src.split('.');
    const type=arr[arr.length-1]
    if (this.data.support.includes(type)) {
      this.previewDocument(src)
      return;
    }
    this.previewImage(src)
  },
  // 预览图片
  previewImage(src){
    wx.previewImage({
      current: src, 
      urls: [src]
    })
  },
  // 预览文档
  previewDocument(url){
    wx.showLoading({
      title: '正在拼命加载...',
    })
    wx.downloadFile({
      url,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fail(){
            wx.showToast({
              title: '文件格式错误请联系管理员',
              icon:'none'
            })
          }
        })
      },
      fail(){
        wx.showToast({
          title: '下载文件失败，请稍后重试！',
          icon:'none'
        })
      },
      complete(){
        wx.hideLoading();
      }
    })
  },
   /**
   * 分享当前页面
   */
  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: details.title
        })
      }, 2000)
    })
    return {
      title: details.title,
      path: `/pages/detail/detail?id=${details.id}`,
      promise 
    }
  },
})