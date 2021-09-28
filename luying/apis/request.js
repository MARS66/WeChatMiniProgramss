
import config from '../config.js'
class Axions {
/**
 * 设置统一的异常处理
 */
  setErrorHandler({msg}) {
    wx.showToast({
      title: msg||'请求失败',
      icon:'error'
    })
  }
  /**
   * 网络请求
   */
  request({url, data, header,loading=false, method,tip='拼命加载中...'}) {
    return new Promise((resolve, reject) => {
      if (loading) {
        wx.showLoading({
          title: tip,
        })
      }
      wx.request({
        url: config.baseUrl + url,
        data,
        header:{
          token:wx.getStorageSync('token')
        },
        method,
        success: (({statusCode,data:{code,msg,data:resDta}}) => {
          if (statusCode === 200 && code===1) {
            resolve(resDta||{})
            wx.hideLoading();
          } else {
            if (this.setErrorHandler != null) {
              wx.hideLoading();
              this.setErrorHandler({msg:statusCode !== 200? "网络错误请稍后重试！":msg})
            }
            resolve(undefined)
          }
        }),
        fail: (res => {
          if (this.setErrorHandler != null) {
            wx.hideLoading();
            this.setErrorHandler({msg:'网络错误请稍后重试！'})
          }
          reject(res)
        })
      })
    })
  }
}

export default Axions